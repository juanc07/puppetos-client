"use client";

import { forwardRef } from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = forwardRef<HTMLDivElement, ChatHistoryProps>(({ messages }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto p-4 border rounded-lg",
        "bg-background", // Uses theme-aware background
        "mb-4"
      )}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            "p-2 my-2 rounded-lg max-w-md",
            msg.sender === "user"
              ? "bg-primary text-primary-foreground ml-auto" // Theme-aware user message styles
              : "bg-muted text-foreground mr-auto" // Theme-aware agent message styles
          )}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
});

ChatHistory.displayName = "ChatHistory";