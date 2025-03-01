export async function sendMessage(message: string, agentId: string): Promise<string> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/agents/interact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, agentId }),
    });
    const data = await response.json();
    return data.reply || "No response from agent";
  }