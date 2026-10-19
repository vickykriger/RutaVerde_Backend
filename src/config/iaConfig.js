import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const iaClient = new OpenAI({
  apiKey: process.env.IA_API_KEY,
  // Si estás usando un proveedor como DeepSeek, OpenRouter o Groq,
  // descomentá la siguiente línea y colocá subaseURL correspondiente:
  // baseURL: 'https://api.deepseek.com' 
});