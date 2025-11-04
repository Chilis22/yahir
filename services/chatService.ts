import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates and returns a new chat session instance.
 * This allows for conversations with history.
 */
export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'Eres un asistente de IA servicial y amigable dentro de la aplicación de productividad WYD. Ayuda a los usuarios con sus preguntas sobre productividad, establecimiento de metas o cualquier otra cosa que necesiten.'
        }
    });
};