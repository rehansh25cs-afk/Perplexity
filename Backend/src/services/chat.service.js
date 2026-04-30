import { ChatGoogleGenerativeAI, } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, createAgent, HumanMessage, SystemMessage, tool } from "langchain";
import * as z from "zod";
import { searchInternet } from "./interner.service.js";

const GEMENI_model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMENI_API_KEY
});

const Mistral_model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
})


const searchInternetTool = tool(
  async ({ query }) => searchInternet(query),
  {
    name: "search-internet",
    description: "Search the internet for relevant information to answer user queries.",
    schema: z.object({
      query: z.string().describe("The search query provided by the user.")
    })
  }
)


const agent = createAgent({
  model: Mistral_model,
  tools: [searchInternetTool]
})


export const generateResponse = async (messages) => {



  const response = await agent.invoke({
    messages: messages.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content)
      } else {
        return new AIMessage(msg.content)
      }
    })
    });

  return response.messages[response.messages.length - 1].text

}


export async function generateChatTitle(message) {

  const response = await Mistral_model.invoke([
    new SystemMessage(`
          You are a helpful assistant that generates concise and descriptive titles for chat conversations.
          
          User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
      `),
    new HumanMessage(`
          Generate a title for a chat conversation based on the following first message:
          "${message}"
          `)
  ])

  return response.text;

}