 async function generateEmbedding(text) {
   const response = await fetch(
    "http://localhost:11434/api/embed",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nomic-embed-text",
        input: text,
      }),
    }
  );
 if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();

  return data.embeddings[0];
}

// async function main() {
//     console.log("Generating embedding for text...");
//   const text = "Employees get 26 weeks of maternity leave.";

//   const embedding = await generateEmbedding(text);

//   console.log("Vector dimensions:", embedding.length);
//   console.log("First five numbers:", embedding.slice(0, 5));
// }

// main().catch(console.error);

module.exports = { generateEmbedding };