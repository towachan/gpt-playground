import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

export interface Message {
  role: string;
  content: string;
}

const GPT_3_5 = "gpt-3.5-turbo";
const systemMessage: Message = {
  "role": "system",
  "content":
    "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: {knowledge_cutoff} Current date: {current_date}",
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config()["OPENAI_API_KEY"]}`,
};

const chatCompletiions = (messages: Message[]) =>
  fetch(`${config()["OPENAI_API"]}/chat/completions`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: GPT_3_5,
      messages: [systemMessage, ...messages],
    }),
  });

export { chatCompletiions };
