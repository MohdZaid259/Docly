import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const extractPdfText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  await parser.destroy();

  return {
    text: data.text,
    pages: data.pages.map((page) => ({ page: page.num, text: page.text })),
  };
};

export const extractDocxText = async (buffer) => {
  const data = await mammoth.extractRawText({ buffer });

  return { text: data.value, pages: [{ page: null, text: data.value }] };
};

export const extractTxtText = (buffer) => {
  const text = buffer.toString("utf-8");

  return { text, pages: [{ page: null, text }] };
};
