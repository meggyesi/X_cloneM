import express, { Request, Response, Router } from 'express';
import { askChatGPT } from '../service/openaiService';


const router: Router = express.Router();

router.post('/ask', async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Hiányzó kérdés' });
    return;
  }

  try {
    console.log('Received message:', message);
    const reply = await askChatGPT(message);
    console.log('Got reply from OpenAI');
    res.json({ response: reply });
  } catch (error: any) {
    console.error('Error in /ask route:', error.message);
    
    res.status(500).json({ 
      error: 'OpenAI API hívás sikertelen',
      details: error.message 
    });
  }
});

router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) + '...'
    }
  });
});

router.get('/debug-key', (req: Request, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    res.status(500).json({ error: 'API key not found in environment variables' });
    return;
  }

  const maskedKey = `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`;
  
  res.json({ 
    keyAvailable: true,
    keyLength: apiKey.length,
    keyPrefix: apiKey.substring(0, 7),
    maskedKey: maskedKey
  });
});

export default router;