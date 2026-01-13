
import { adviceApi } from './api';

export async function getDrinkingAdvice(currentAmount: number, dailyGoal: number): Promise<string> {
  try {
    return await adviceApi.get(currentAmount, dailyGoal);
  } catch (error) {
    console.error("Advice API error:", error);
    return "喝水可以提升您的精力和大脑功能。";
  }
}
