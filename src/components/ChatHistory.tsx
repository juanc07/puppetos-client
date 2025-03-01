import { forwardRef } from "react";
import { Message } from "@/lib/types";

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = forwardRef<HTMLDivElement, ChatHistoryProps>(({ messages }, ref) => {
  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-50 mb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 my-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black mr-auto"} max-w-md`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
});

ChatHistory.displayName = "ChatHistory";