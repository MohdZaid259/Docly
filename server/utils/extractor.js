import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const extractPdfText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  await parser.destroy();

  return data.text;
};

export const extractDocxText = async (buffer) => {
  const data = await mammoth.extractRawText({ buffer });

  return data.value;
};