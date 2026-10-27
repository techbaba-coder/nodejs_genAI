RAG Example
===========

This example shows the basic steps of Retrieval-Augmented Generation (RAG).
RAG first looks up text that is related to a question, then gives that text to
a language model so it can write an answer based on the provided information.

What the program does
---------------------

1. Splits the sample employee document into small word-based chunks.
2. Creates an embedding for each chunk. An embedding is a list of numbers that
   represents the meaning of a piece of text.
3. Creates an embedding for the question.
4. Compares the question embedding with each chunk embedding using cosine
   similarity. A higher score means the chunk is more related to the question.
5. Sends the highest-scoring chunk and the question to the language model.
6. Prints the model's answer.

Files needed
------------

Place these three helper files in the same folder as rag.js:

  embed.js              Exports generateEmbedding(text)
  cosineSimilarity.js   Exports cosineSimilarity(vectorA, vectorB)
  generateAns.js        Exports generateAnswer(prompt)

The helper modules are separate from this example. If they are not in this
folder, Node.js will report that it cannot find one of the modules.

Requirements
------------

- Node.js with built-in fetch support (Node.js 18 or newer).
- Ollama running locally at http://localhost:11434.
- The embedding model used by embed.js (in this example: nomic-embed-text).
- The language model used by generateAns.js (in this example: qwen3.5:4b).

Download the models in Ollama before running the program:

  ollama pull nomic-embed-text
  ollama pull qwen3.5:4b

The model names above must match the names configured in the helper files.

How to run
----------

Open a terminal in this folder and run:

  node rag.js

Understanding chunk size and overlap
------------------------------------

CHUNK_SIZE controls the maximum number of words in each chunk. CHUNK_OVERLAP
controls how many words from one chunk are repeated in the next chunk. The
overlap helps keep nearby ideas together when a sentence happens to be split
between chunks.

For example, with a chunk size of 8 and an overlap of 2, the next chunk starts
6 words after the previous chunk started.

TOP_K controls how many of the best matching chunks are sent to the language
model. It is set to 1 in this example.

Try changing DOCUMENT and QUESTION near the top of rag.js to experiment with
different sample text and questions.
