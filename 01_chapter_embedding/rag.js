const { generateEmbedding } = require("./embed.js");
const { cosineSimilarity } = require("./cosineSimilarity.js");
const { generateAnswer } = require("./generateAns.js");

const DOCUMENT = `
  Employees receive 26 weeks of maternity leave.
  Employees can request annual leave through HR.
  Permanent employees receive health insurance.
`;
const QUESTION = "Which employees receive health insurance?";
const CHUNK_SIZE = 8;
const CHUNK_OVERLAP = 2;
const TOP_K = 1;

function splitIntoChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  if (typeof text !== "string") {
    throw new TypeError("Text to split must be a string.");
  }

  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError("Chunk size must be a positive whole number.");
  }

  if (!Number.isInteger(overlap) || overlap < 0 || overlap >= chunkSize) {
    throw new RangeError("Overlap must be a whole number smaller than chunk size.");
  }

  const normalizedText = text.trim().replace(/\s+/g, " ");
  if (normalizedText.length === 0) {
    return [];
  }

  const words = normalizedText.split(" ");
  const step = chunkSize - overlap;
  const chunks = [];

  for (let start = 0; start < words.length; start += step) {
    chunks.push(words.slice(start, start + chunkSize).join(" "));
  }

  return chunks;
}

async function createEmbeddingRecords(chunks) {
  const records = [];

  for (const text of chunks) {
    const embedding = await generateEmbedding(text);
    records.push({ text, embedding });
  }

  return records;
}

function rankChunksByRelevance(records, questionEmbedding) {
  return records
    .map((record) => ({
      text: record.text,
      score: cosineSimilarity(questionEmbedding, record.embedding),
    }))
    .sort((first, second) => second.score - first.score);
}

function buildPrompt(context, question) {
  return `
Answer the question using only the context below.
If the answer is not present in the context, say you don't know.

Context:
${context}

Question:
${question}

Answer:
`;
}

async function main() {
  const chunks = splitIntoChunks(DOCUMENT);
  console.log("All chunks:", chunks);
  console.log("Number of chunks:", chunks.length);

  const records = await createEmbeddingRecords(chunks);
  console.log("Number of records:", records.length);

  if (records.length === 0) {
    console.log("Answer: Sorry, there is no document text to search.");
    return;
  }

  console.log("First record text:", records[0].text);
  console.log("First vector dimensions:", records[0].embedding.length);

  const questionEmbedding = await generateEmbedding(QUESTION);
  console.log("Query vector dimensions:", questionEmbedding.length);

  const rankedChunks = rankChunksByRelevance(records, questionEmbedding);
  console.log("Ranked chunks:", rankedChunks);

  const bestChunks = rankedChunks.slice(0, TOP_K);
  console.log("Retrieved context:", bestChunks);

  if (bestChunks.length === 0) {
    console.log(
      "Answer: Sorry, I couldn't find this information in the available documents."
    );
    return;
  }

  const context = bestChunks.map((chunk) => chunk.text).join("\n");
  const prompt = buildPrompt(context, QUESTION);
  const answer = await generateAnswer(prompt);

  console.log("\nQuestion:", QUESTION);
  console.log("Answer:", answer);
}

main().catch((error) => {
  console.error("RAG example failed:", error);
  process.exitCode = 1;
});
