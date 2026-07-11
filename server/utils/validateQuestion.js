const MAX_QUESTION_LENGTH = 2000;

export const validateQuestion = (question) => {
  if (typeof question !== "string" || !question.trim()) {
    return "A question is required.";
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`;
  }

  return null;
};
