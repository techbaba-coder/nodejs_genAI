
module.exports = { cosineSimilarity };

function cosineSimilarity(a, b) {
  // 1. Calculate dot product
  let dotProduct = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
  }

  // 2. Calculate both magnitudes
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // 3. Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // 4. Calculate cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}

const a = [3, 4];
const b = [3, 4];

console.log(cosineSimilarity(a, b)); // 1
