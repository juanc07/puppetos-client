"use client";

import { useState, useRef, useEffect } from "react";
import { ChatHistory } from "@/components/ChatHistory"; // Corrected path
import { MessageInput } from "@/components/MessageInput"; // Corrected path
import { AgentSelector } from "@/components/AgentSelector"; // Corrected path
import { sendMessage } from "@/lib/api";
import { Message, Agent } from "@/lib/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentId, setAgentId] = useState("3e3283ef-b9a0-4c8e-a902-a0a2b6d2a924"); // Zeek
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const agents: Agent[] = [
    { id: "3e3283ef-b9a0-4c8e-a902-a0a2b6d2a924", name: "Zeek" },
    { id: "<uuid2>", name: "Luna" }, // Replace with Luna’s ID
  ];

  const handleSend = async (text: string) => {
    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendMessage(text, agentId);
      const agentMessage: Message = { sender: "agent", text: reply };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: "agent", text: `Error: ${(error as Error).message}` };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex flex-col h-screen w-[75%] mx-auto p-4 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-between items-center mb-4 relative">
        <AgentSelector agents={agents} selectedAgentId={agentId} onSelect={setAgentId} />
      </div>
      <div className="flex-1 overflow-y-auto pb-20" ref={chatRef}>
        <ChatHistory messages={messages} />
      </div>
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[75%] p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}