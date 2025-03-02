export async function sendMessage(message: string, agentId: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${apiUrl}/api/agents/interact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message,agentId }), // Removed `agentId` since the API does not use it
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.reply || "No response from agent";
}

export async function sendMessageStream(
  message: string,
  agentId: string,
  onChunk: (chunk: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiUrl}/api/agents/interact-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, agentId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") {
              return;
            }
            const parsed = JSON.parse(data);
            if (parsed.reply) {
              onChunk(parsed.reply); // Call the callback with each chunk
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          }
        }
      }
    }
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      throw error; // Re-throw if no error handler provided
    }
  }
}
