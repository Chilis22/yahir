import { GoogleGenAI, Content, Type, Part } from "@google/genai";
import type { Message, MissionPlan } from '../types';

// NOTE: API_KEY is expected to be in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const conversationalModel = 'gemini-2.5-flash';
const jsonModel = 'gemini-2.5-flash';

const conversationalSystemInstruction = "Eres Wyz, un Director de Juego personal, amigable y motivador. Tu objetivo es guiar al usuario a través de una configuración inicial para gamificar sus metas. Sigue este flujo: 1. Pregunta su nombre. 2. Después de que respondan, salúdalos por su nombre y pregúntales sobre su objetivo principal. 3. Una vez que especifiquen su objetivo, haz preguntas de sondeo para entenderlo mejor, puedes pedirles que adjunten documentos o imágenes si ayuda. 4. Cuando sientas que tienes suficiente información, di exactamente la frase: 'Perfecto. He diseñado un plan de misiones inicial para ti. ¿Listo para empezar?' y nada más. Sé conciso y mantén un tono de aventura. No uses markdown.";

const mapMessagesToGeminiContent = (messages: Message[]): Content[] => {
    // The Gemini API requires alternating user and model roles.
    const filteredMessages = messages.filter((msg, i, arr) => {
        if (i === 0) return true;
        return msg.sender !== arr[i-1].sender;
    });

    return filteredMessages.map(msg => {
        const parts: Part[] = [{ text: msg.text }];
        if (msg.file) {
            parts.push(msg.file);
        }
        return {
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: parts
        };
    });
};

export const getOnboardingResponse = async (history: Message[]): Promise<string> => {
    try {
        const contents = mapMessagesToGeminiContent(history);
        const response = await ai.models.generateContent({
            model: conversationalModel,
            contents: contents,
            config: {
                systemInstruction: conversationalSystemInstruction,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for onboarding:", error);
        return "Parece que hay una interferencia en nuestra comunicación. ¡Pero no te preocupes, la aventura debe continuar! ¿Estás listo?";
    }
};


const missionPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Un nombre de mapa o aventura creativo y temático para el plan. Por ejemplo: 'El Mapa del Saber' o 'La Senda del Atleta'."
    },
    description: {
      type: Type.STRING,
      description: "Una breve descripción de 1 frase del objetivo general del plan. Por ejemplo: 'Tu aventura para aprobar Cálculo y Marketing.'"
    },
    missions: {
      type: Type.ARRAY,
      description: "Una lista de exactamente 5 misiones o niveles secuenciales.",
      items: {
        type: Type.OBJECT,
        properties: {
          level: { type: Type.INTEGER, description: "El número del nivel, comenzando desde 1." },
          title: { type: Type.STRING, description: "Un título de misión corto y accionable para la tarea." },
          completed: { type: Type.BOOLEAN, description: "Siempre debe ser `false` inicialmente." }
        },
        required: ["level", "title", "completed"]
      }
    }
  },
  required: ["title", "description", "missions"]
};

export const generateMissionPlan = async (history: Message[]): Promise<MissionPlan> => {
    const planGenerationInstruction = "Actúa como un diseñador de juegos experto. Basándote en toda la conversación anterior, crea un plan de misiones inicial para el usuario. El plan debe consistir en un título temático para la aventura, una breve descripción y una lista de exactamente 5 misiones accionables y secuenciales que ayuden al usuario a alcanzar su objetivo. Responde únicamente con el objeto JSON estructurado.";
    
    // Add the final instruction to the history for the generation call
    const finalHistory = [...history, { sender: 'user' as const, text: planGenerationInstruction }];
    const contents = mapMessagesToGeminiContent(finalHistory);

    try {
        const response = await ai.models.generateContent({
            model: jsonModel,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: missionPlanSchema,
            }
        });
        
        // The response text is a JSON string, so we parse it.
        const plan = JSON.parse(response.text) as MissionPlan;
        
        // Basic validation
        if (!plan.title || !plan.missions || plan.missions.length !== 5) {
            throw new Error("El plan generado por la IA no es válido.");
        }
        
        return plan;
    } catch (error) {
        console.error("Error generating mission plan with Gemini:", error);
        // Fallback plan if the API fails
        return {
            title: "Misión de Rescate",
            description: "Recupera tu plan de aventura.",
            missions: [
                { level: 1, title: "Revisar la conexión con la IA", completed: false },
                { level: 2, title: "Reintentar la creación del plan", completed: false },
                { level: 3, title: "Contactar al soporte si el problema persiste", completed: false },
                { level: 4, title: "Definir una meta simple manualmente", completed: false },
                { level: 5, title: "Completar la primera meta manual", completed: false },
            ]
        };
    }
};