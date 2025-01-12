"use strict";

import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { fetchUrlAsBase64String } from "./fetchUrlAsBase64String.js";
import dotenv from "dotenv";
dotenv.config();

const HUGGINGFACEHUB_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;
if (!HUGGINGFACEHUB_API_KEY)
  throw new Error("HUGGINGFACEHUB_API_KEY is undefined.");

class Agent {
  constructor(id, name, model, instructions) {
    this.id = id;
    this.name = name;
    this.model = model;
    this.instructions = instructions;
    this.llm = new HuggingFaceInference({
      apiKey: HUGGINGFACEHUB_API_KEY,
      model: this.model,
      temperature: 0.7,
      maxTokens: 200,
    });
  }

  async chat(prompt, fileUrl) {
    const base64String = fileUrl ? await fetchUrlAsBase64String(fileUrl) : "";
    console.log({ base64String: !!base64String });

    const userMessage = {
      type: "text",
      text: prompt,
    };

    const mediaTypeMessage = {
      type: "image_url",
      image_url: {
        url: "data:image/png;base64," + base64String,
      },
    };

    const promptTemplate = ChatPromptTemplate.fromMessages([
      new SystemMessage({
        content: `Your name is ${this.name}. ${this.instructions}`,
      }),
      new HumanMessage({
        content: fileUrl ? [userMessage, mediaTypeMessage] : [userMessage],
      }),
    ]);

    const message = await this.llm.invoke(
      `Your name is ${this.name}. ${this.instructions}. Please response my message: ${prompt}`
    );

    console.log({ visionAssistantResponse: message });
    console.log({ typeOfResponse: typeof message });
    return message;
  }
}

export { Agent };
