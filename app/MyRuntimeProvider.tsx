"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  TextMessagePart,
  ThreadAssistantMessagePart,
  ThreadMessage,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
// import { openai } from "@ai-sdk/openai";
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey: "dummy",
    baseURL: "http://localhost:8000/v1",
    dangerouslyAllowBrowser: true
});

const convertToOpenAIMessages = (messages: readonly ThreadMessage[]):Array<ChatCompletionMessageParam> => {
    return messages.map((message) => {
        if (message.role === "user") {
            return { role: "user", content: (message.content[0] as TextMessagePart).text };
        } else if (message.role === "assistant") {
            return { role: "assistant", content: (message.content[0] as TextMessagePart).text };
        } else {
            throw new Error(`Unsupported message role: ${message.role}`);
        }
    })
}

const makeMyModelAdapter= (model:string = "z-ai/glm-4.5-air:free"): ChatModelAdapter => { 
  return {
    async *run({ messages, abortSignal, context }) {
      console.log(messages)
      const stream = await openai.chat.completions.create({
        // model: "moonshotai/kimi-k2:free",
        model,
        messages: convertToOpenAIMessages(messages),
        // tools: context.tools,
        stream: true,
      });
      
      // fetch("http://localhost:8000/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // forward the messages in the chat to the API
      //   body: JSON.stringify({
      //     messages,
      //   }),
      //   // if the user hits the "cancel" button or escape keyboard key, cancel the request
      //   signal: abortSignal,
      // });

      let content: ThreadAssistantMessagePart[] = [];
      let text = "";
      for await (const part of stream) {
        const deltaContent = part.choices[0]?.delta?.content || ""
        if (deltaContent.includes("[Retrieving Data...]")) {
          if (text.length > 0) {
            content.push({ type: "text", text });
            text = "";
          }
          yield {
            content: [
              ...content,
              { type: "tool-call", toolCallId: '', toolName: "executeSql", args: {sql: ''}, argsText: 'executeSql' }
            ],
          };
        } else if (deltaContent.includes("[Data retrieved]")) {
          content.push({ type: "tool-call", toolCallId: '', toolName: "executeSql", args: {sql: ''}, argsText: 'executeSql', result: 'SQL result' })
          yield {
            content,
          };
        } else if (deltaContent.includes("[Executing Python...]")) {
          if (text.length > 0) {
            content.push({ type: "text", text });
            text = "";
          }
          yield {
            content: [
              ...content,
              { type: "tool-call", toolCallId: '', toolName: "executePython", args: {sql: ''}, argsText: 'executePython' }
            ],
          };
        } else if (deltaContent.includes("[Python executed]")) {
          content.push({ type: "tool-call", toolCallId: '', toolName: "executePython", args: {sql: ''}, argsText: 'executePython', result: 'Python result' })
          yield {
            content,
          };
        } else {
          text += deltaContent;
          yield {
            content: [
              ...content,
              { type: "text", text }],
          };
        }
      }
    }
  }
};

export function MyRuntimeProvider({
  model,
  children,
}: Readonly<{
  model?: string;
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(makeMyModelAdapter(model));

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}