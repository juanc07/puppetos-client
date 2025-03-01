"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", !isDarkMode);
    }
  };

  return (
    <header className="p-4 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600">
        PuppetOS Chat
      </Link>
      <nav className="flex gap-4 items-center">
        <Link href="/chat" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
          Chat
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </nav>
    </header>
  );
}