import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtensions = [".pdf", ".doc", ".docx"];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();
  const isAllowed =
    allowedExtensions.includes(extension) || allowedMimeTypes.includes(mimeType);

  if (isAllowed) {
    cb(null, true);
    return;
  }

  cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

export default upload;