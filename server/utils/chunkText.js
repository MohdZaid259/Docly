export const chunkText = (
  pages,
  chunkSize = 500,
  overlap = 100
) => {
  const chunks = [];

  for (const { page, text } of pages) {
    const words = text.split(/\s+/).filter(Boolean);
    let start = 0;

    while (start < words.length) {
      const end = start + chunkSize;
      const chunkWords = words.slice(start, end);

      if (chunkWords.length > 0) {
        chunks.push({ page, text: chunkWords.join(" ") });
      }

      start += chunkSize - overlap;
    }
  }

  return chunks;
};
