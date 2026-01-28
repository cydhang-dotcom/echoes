import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generatePoeticLocation = async (lat: number, lng: number): Promise<string> => {
  if (!ai) return "地球某处 · 未知时间";

  try {
    const prompt = `
      The user is at coordinates ${lat}, ${lng}. 
      Generate a very short, poetic, "Zhíniàn植念" style location description in Simplified Chinese.
      It should feel organic, grounding, and non-technical.
      Format: "City (or Natural Feature) · Contextual Detail Time".
      
      Examples: 
      "京都 · 苔藓神社旁 16:42"
      "伦敦 · 柳树低垂的河岸 09:15"
      "无名森林 · 风很轻 23:11"
      "上海 · 梧桐树下 15:42"
      
      Do not mention the coordinates. Keep it under 10 Chinese characters if possible, excluding time.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "地球 · 呼吸缓慢";
  } catch (error) {
    console.error("Gemini Poetic Location Error:", error);
    return "风 · 记得这里";
  }
};