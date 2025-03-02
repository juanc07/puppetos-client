"use client";

import { useState, useRef, useEffect } from "react";
import { ChatHistory } from "@/components/ChatHistory";
import { MessageInput } from "@/components/MessageInput";
import { AgentSelector } from "@/components/AgentSelector";
import { sendMessage,sendMessageStream } from "@/lib/api";
import { Message, Agent } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentId, setAgentId] = useState<string>("3e3283ef-b9a0-4c8e-a902-a0a2b6d2a924");
  const [agents, setAgents] = useState<Agent[]>([
    { id: "3e3283ef-b9a0-4c8e-a902-a0a2b6d2a924", name: "Zeek" },
    { id: "agentId2", name: "Luna" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/agents/getAgentIds");
        const data = await response.json();

        if (data.agentInfo && Array.isArray(data.agentInfo)) {
          const fetchedAgents = data.agentInfo.map((agent: any) => ({
            id: agent.agentId,
            name: agent.name || "Unnamed Agent",
          }));
          setAgents(fetchedAgents);
          if (fetchedAgents.length > 0 && !agentId) {
            setAgentId(fetchedAgents[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "agent", text: "Failed to load agents. Using defaults." },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!agentId) {
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Please select an agent first." },
      ]);
      return;
    }

    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendMessage(text, agentId);
      const agentMessage: Message = { sender: "agent", text: reply };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: "agent",
        text: `Error: ${(error as Error).message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }    
  };

  const handleSendStream = async (text: string) => {
    if (!agentId) {
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Please select an agent first." },
      ]);
      return;
    }

    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);    

    try {
      let agentResponse = ""; // Accumulate the streamed response
      await sendMessageStream(
        text,
        agentId,
        (chunk) => {
          // Handle each chunk as it arrives
          agentResponse += chunk;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            // If the last message is from the agent, update it; otherwise, add a new one
            if (lastMessage?.sender === "agent") {
              return [
                ...prev.slice(0, -1),
                { sender: "agent", text: agentResponse },
              ];
            }
            return [...prev, { sender: "agent", text: agentResponse }];
          });
        },
        (error) => {
          // Handle errors during streaming
          const errorMessage: Message = {
            sender: "agent",
            text: `Error: ${error.message}`,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      );
    } catch (error) {
      // Handle errors from the initial fetch or setup
      const errorMessage: Message = {
        sender: "agent",
        text: `Error: ${(error as Error).message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col", "bg-background")}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold">AI Chat</h1>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <span className="text-muted-foreground">Loading agents...</span>
            ) : (
              <AgentSelector
                agents={agents}
                selectedAgentId={agentId}
                onSelect={setAgentId}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-12rem)] flex flex-col">
          <CardContent className="flex-1 p-6 overflow-y-auto" ref={chatRef}>
            <ChatHistory messages={messages} />
          </CardContent>
        </Card>
      </main>

      {/* Message Input */}
      <footer className="sticky bottom-0 bg-background border-t">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <MessageInput onSend={handleSendStream} />
        </div>
      </footer>
    </div>
  );
}