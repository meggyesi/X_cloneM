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
const express_1 = __importDefault(require("express"));
const openaiService_1 = require("../service/openaiService");
const router = express_1.default.Router();
router.post('/ask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message) {
        res.status(400).json({ error: 'Hiányzó kérdés' });
        return;
    }
    try {
        console.log('Received message:', message);
        const reply = yield (0, openaiService_1.askChatGPT)(message);
        console.log('Got reply from OpenAI');
        res.json({ response: reply });
    }
    catch (error) {
        console.error('Error in /ask route:', error.message);
        res.status(500).json({
            error: 'OpenAI API hívás sikertelen',
            details: error.message
        });
    }
}));
router.get('/test', (req, res) => {
    var _a;
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        env: {
            hasApiKey: !!process.env.OPENAI_API_KEY,
            apiKeyPrefix: ((_a = process.env.OPENAI_API_KEY) === null || _a === void 0 ? void 0 : _a.substring(0, 7)) + '...'
        }
    });
});
router.get('/debug-key', (req, res) => {
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
exports.default = router;
