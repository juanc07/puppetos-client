"use client";

import { forwardRef, useState } from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = forwardRef<HTMLDivElement, ChatHistoryProps>(({ messages }, ref) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // Track which message was copied

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index); // Set the copied message index
        console.log("Text copied to clipboard:", text);
        // Reset after 2 seconds
        setTimeout(() => setCopiedIndex(null), 2000);
      },
      (err) => {
        console.error("Failed to copy text:", err);
      }
    );
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto p-4 border rounded-lg",
        "bg-background",
        "mb-4"
      )}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            "p-2 my-2 rounded-lg max-w-md",
            msg.sender === "user"
              ? "bg-primary text-primary-foreground ml-auto"
              : "bg-muted text-foreground mr-auto"
          )}
        >
          <div className="mb-2">{msg.text}</div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(msg.text, index)}
              className="p-1 h-8 w-8"
              aria-label={copiedIndex === index ? "Message copied" : "Copy message"}
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {/* Placeholder for future buttons */}
            {/* <Button variant="ghost" size="sm" className="p-1 h-8 w-8" aria-label="Future action 1">
              <SomeIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8" aria-label="Future action 2">
              <AnotherIcon className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      ))}
    </div>
  );
});

ChatHistory.displayName = "ChatHistory";