// import { createOpenAI } from "@ai-sdk/openai";
// import {
//   streamText,
//   UIMessage,
//   convertToModelMessages,
// } from "ai";

// const aiAgent = createOpenAI({
//   apiKey: process.env.GROQ_API_KEY ?? "",
//   baseURL: "http://localhost:8000/v1",
// });

// export async function POST(req: Request) {
//   const { messages }: { messages: UIMessage[] } = await req.json();
//   const result = streamText({
//     model: aiAgent("z-ai/glm-4.5-air:free"),
//     messages: convertToModelMessages(messages),
//   });

//   return result.toUIMessageStreamResponse();
// }
