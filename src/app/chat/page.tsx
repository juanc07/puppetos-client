"use client";

import { useState, useRef, useEffect } from "react";
import { ChatHistory } from "@/components/ChatHistory";
import { MessageInput } from "@/components/MessageInput";
import { AgentSelector } from "@/components/AgentSelector";
import { sendMessageStream } from "@/lib/api";
import { Message, Agent } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentId, setAgentId] = useState<string | null>(null); // No hardcoded default
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start as true to ensure loading
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch agents from API and set first agent as default
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === 'production';
    // Use NEXT_PUBLIC_API_URL, fallback to localhost only if unset
    const apiRoot = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiRoot}/api/agents/getAgentIds`);
        const data = await response.json();

        if (data.agentInfo && Array.isArray(data.agentInfo)) {
          const fetchedAgents = data.agentInfo.map((agent: any) => ({
            id: agent.agentId,
            name: agent.name || "Unnamed Agent",
          }));
          setAgents(fetchedAgents);
          if (fetchedAgents.length > 0) {
            setAgentId(fetchedAgents[0].id); // Set first agent as default after loading
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "system", text: "No agents available." },
          ]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "system", text: "Failed to load agents. Please try again later." },
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

  const handleSendStream = async (text: string) => {
    if (!agentId) {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Please select an agent first." },
      ]);
      return;
    }

    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let agentResponse = "";
      await sendMessageStream(
        text,
        agentId,
        (chunk) => {
          agentResponse += chunk;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
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
          const errorMessage: Message = {
            sender: "system",
            text: `Error: ${error.message}`,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      );
    } catch (error) {
      const errorMessage: Message = {
        sender: "system",
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
            ) : agents.length === 0 ? (
              <span className="text-muted-foreground">No agents available</span>
            ) : (
              <AgentSelector
                agents={agents}
                selectedAgentId={agentId} // Type is string | null
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
          <MessageInput onSend={handleSendStream} disabled={!agentId || isLoading} />
        </div>
      </footer>
    </div>
  );
}