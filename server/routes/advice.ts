import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Get AI drinking advice
router.post('/', async (req: Request, res: Response) => {
  try {
    const { currentAmount, dailyGoal } = req.body;

    if (typeof currentAmount !== 'number' || typeof dailyGoal !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid parameters: currentAmount, dailyGoal' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const percentage = Math.round((currentAmount / dailyGoal) * 100);
    
    const prompt = `
      你是一个健康的饮水助手。
      用户信息：
      - 当前已饮水: ${currentAmount}ml
      - 每日目标: ${dailyGoal}ml
      - 完成进度: ${percentage}%
      
      请用一句话提供一个贴心、简短且科学的饮水建议。限制在20个字以内。
      如果是早上，提醒唤醒身体。
      如果是下午，提醒补充能量。
      如果是深夜，建议适量减少。
      如果快达标了，给予鼓励。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.7,
      }
    });

    const advice = response.text || "多喝水，保持身体活力！";
    res.json({ advice });
  } catch (error: any) {
    console.error("Gemini advice error:", error);
    res.status(500).json({ 
      error: error.message || 'Failed to get AI advice',
      advice: "喝水可以提升您的精力和大脑功能。"
    });
  }
});

export default router;
