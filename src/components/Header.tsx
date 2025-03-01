import Link from "next/link";

export function Header() {
  return (
    <header className="p-4 border-b bg-white flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
        PuppetOS Chat
      </Link>
      <nav className="flex gap-4">
        <Link href="/chat" className="text-gray-600 hover:text-blue-500">
          Chat
        </Link>
        {/* Add more nav links if needed, e.g., Settings or About */}
      </nav>
    </header>
  );
}