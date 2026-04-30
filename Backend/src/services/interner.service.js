import { tavily } from '@tavily/core'

const tavily_client = tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export const searchInternet = async (query) =>{
    return await tavily_client.search(
        query,
        {
            numResults: 5,
            searchDepth: "advanced",
        }
    );
    
}