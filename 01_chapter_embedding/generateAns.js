
async function generateAnswer(prompt) {
  const response = await fetch(
    "http://localhost:11434/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3.5:4b",
        prompt: prompt,
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();

  return data.response;
}

module.exports = { generateAnswer };