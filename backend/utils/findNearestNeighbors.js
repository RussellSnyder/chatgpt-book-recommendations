const cosineSimilarity = require("./cosineSimilarity");

const findNearestNeighbors = async ({ embedding, embeddings, k }) => {
  const similarities = embeddings.map((item) => {
    const similarity = cosineSimilarity(embedding, JSON.parse(item.embedding));
    return {
      similarity,
      ...item,
    };
  });

  similarities.sort((a, b) => b.similarity - a.similarity);

  const nearestNeighbors = similarities.slice(0, k);

  return nearestNeighbors;
};

module.exports = findNearestNeighbors;
