import { openai } from "./chat.service.js";

export const generateSummary = async (text) => {
  const truncatedText = text.slice(0, 12000);

  const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            Generate a precise summary.
            Focus on:
            - Main purpose
            - Important facts
            - Key takeaways
            Keep it under 200 words.
          `,
        },
        {
          role: "user",
          content: truncatedText,
        },
      ],
    });

  return response.choices[0].message.content;
};