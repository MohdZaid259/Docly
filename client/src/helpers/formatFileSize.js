const UNITS = ["B", "KB", "MB", "GB"];

export const formatFileSize = (size) => {
  if (!size) return "0 KB";

  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${UNITS[unitIndex]}`;
};
