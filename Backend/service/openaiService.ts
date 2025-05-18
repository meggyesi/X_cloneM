import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function askChatGPT(message: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('Missing OpenAI API key');
    throw new Error('API key not configured');
  }
  
  try {
    console.log('Sending request to OpenAI API');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Using a standard model
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    console.log('Response received');
    
    // According to the OpenAI docs, the response structure should include choices array
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      // The message property should contain the response text
      if (response.data.choices[0].message && response.data.choices[0].message.content) {
        return response.data.choices[0].message.content;
      } else {
        console.error('Unexpected response structure - missing message content:', JSON.stringify(response.data));
        throw new Error('Unexpected response structure from OpenAI API');
      }
    } else {
      console.error('Unexpected response structure - missing choices:', JSON.stringify(response.data));
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error: any) {
    console.error('Error in askChatGPT function:');
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('OpenAI API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: JSON.stringify(error.response.data)
      });
      
      // Handle specific error codes according to OpenAI's documentation
      if (error.response.status === 401) {
        throw new Error('Authentication error: Invalid API key');
      } else if (error.response.status === 429) {
        throw new Error('Rate limit exceeded or quota exceeded');
      } else if (error.response.status === 400) {
        // For bad requests, include the error message from OpenAI if available
        const errorMessage = error.response.data.error?.message || 'Bad request to OpenAI API';
        throw new Error(`Bad request: ${errorMessage}`);
      } else if (error.response.status === 404) {
        throw new Error('Resource not found - check the model name');
      } else if (error.response.status === 500) {
        throw new Error('OpenAI server error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from OpenAI API');
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
    
    throw error;
  }
}