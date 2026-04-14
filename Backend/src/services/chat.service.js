import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMENI_API_KEY
});

export const testModel = async(inputText)=>{
    const response = await model.invoke(inputText)
    console.log(response.text); 
}