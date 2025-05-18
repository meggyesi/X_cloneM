"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askChatGPT = askChatGPT;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function askChatGPT(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const apiKey = (_a = process.env.OPENAI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
        if (!apiKey) {
            console.error('Missing OpenAI API key');
            throw new Error('API key not configured');
        }
        try {
            console.log('Sending request to OpenAI API');
            const response = yield axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo', // Using a standard model
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 500
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            console.log('Response received');
            // According to the OpenAI docs, the response structure should include choices array
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                // The message property should contain the response text
                if (response.data.choices[0].message && response.data.choices[0].message.content) {
                    return response.data.choices[0].message.content;
                }
                else {
                    console.error('Unexpected response structure - missing message content:', JSON.stringify(response.data));
                    throw new Error('Unexpected response structure from OpenAI API');
                }
            }
            else {
                console.error('Unexpected response structure - missing choices:', JSON.stringify(response.data));
                throw new Error('Unexpected response structure from OpenAI API');
            }
        }
        catch (error) {
            console.error('Error in askChatGPT function:');
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error('OpenAI API Error:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data)
                });
                // Handle specific error codes according to OpenAI's documentation
                if (error.response.status === 401) {
                    throw new Error('Authentication error: Invalid API key');
                }
                else if (error.response.status === 429) {
                    throw new Error('Rate limit exceeded or quota exceeded');
                }
                else if (error.response.status === 400) {
                    // For bad requests, include the error message from OpenAI if available
                    const errorMessage = ((_b = error.response.data.error) === null || _b === void 0 ? void 0 : _b.message) || 'Bad request to OpenAI API';
                    throw new Error(`Bad request: ${errorMessage}`);
                }
                else if (error.response.status === 404) {
                    throw new Error('Resource not found - check the model name');
                }
                else if (error.response.status === 500) {
                    throw new Error('OpenAI server error');
                }
            }
            else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('No response received from OpenAI API');
            }
            else {
                // Something else happened while setting up the request
                console.error('Error setting up request:', error.message);
                throw new Error(`Error: ${error.message}`);
            }
            throw error;
        }
    });
}
