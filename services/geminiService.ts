import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FolkloreResponse } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFolkloreStory = async (
  region: string,
  context?: string
): Promise<FolkloreResponse> => {
  const ai = getClient();
  
  const prompt = `
    Act as an expert historian and folklore storyteller of Argentina from the late 19th century (around 1882).
    
    User Request: Tell me a mysterious, short folklore legend or myth specifically from the region of "${region}" ${context ? `(${context})` : ''}.
    
    Requirements:
    1. The story must be atmospheric, slightly eerie, or magical.
    2. Keep it under 250 words.
    3. Write in evocative Spanish (Español Rioplatense of the era if possible, but readable).
    4. Provide a catchy, archaic title.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The title of the legend" },
      story: { type: Type.STRING, description: "The content of the story" },
    },
    required: ["title", "story"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a 'Gaucho' storyteller sitting by a fire in 1882.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as FolkloreResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "El Silencio de la Pampa",
      story: "Las voces de los antiguos espíritus callan hoy. Intenta conectar de nuevo más tarde para escuchar sus susurros..."
    };
  }
};
