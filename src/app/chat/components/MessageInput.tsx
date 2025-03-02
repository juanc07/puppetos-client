// @/components/MessageInput.tsx
"use client";
import { forwardRef,useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean; // Add disabled prop
}

export const MessageInput = forwardRef<HTMLInputElement, MessageInputProps>(
  ({ onSend, disabled }, ref) => {
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
          className="flex-1 p-2 border rounded disabled:bg-gray-200 dark:disabled:bg-gray-700"
        />
        <button
          type="submit"
          disabled={disabled}
          className="p-2 bg-primary text-white rounded disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          Send
        </button>
      </form>
    );
  }
);

MessageInput.displayName = "MessageInput";