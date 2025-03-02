// @/components/MessageInput.tsx
"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import shadcn/ui Button for better theming

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput = forwardRef<HTMLInputElement, MessageInputProps>(
  ({ onSend, disabled = false }, ref) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (text.trim() && !disabled) {
        onSend(text);
        setText("");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={ref}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className={cn(
            "flex-1 p-2 border rounded",
            "bg-background text-foreground", // Ensure input adapts to theme
            disabled && "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          )}
          placeholder="Type your message..."
        />
        <Button
          type="submit"
          disabled={disabled}
          className={cn(
            "p-2", // Base padding
            disabled && "cursor-not-allowed" // Disabled cursor
          )}
        >
          Send
        </Button>
      </form>
    );
  }
);

MessageInput.displayName = "MessageInput";