export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
export const ACCEPT_ATTRIBUTE = `${ALLOWED_EXTENSIONS.join(",")},${ALLOWED_MIME_TYPES.join(",")}`;

export const isAllowedFile = (selectedFile) => {
  if (!selectedFile) return false;
  const fileName = selectedFile.name.toLowerCase();
  const mimeType = selectedFile.type.toLowerCase();

  return (
    ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension)) ||
    ALLOWED_MIME_TYPES.includes(mimeType)
  );
};
