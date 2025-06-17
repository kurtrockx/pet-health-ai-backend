export async function fetchLlama(history) {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3", messages: history }),
  });

  const data = await res.json();
  return data.message.content;
}
