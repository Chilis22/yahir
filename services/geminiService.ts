import { GoogleGenAI, Content, Type, Part, Chat } from "@google/genai";
import type { Message, MissionPlan, AppState } from '../types';

// NOTE: API_KEY is expected to be in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const conversationalModel = 'gemini-2.5-flash';
const jsonModel = 'gemini-2.5-flash';

const conversationalSystemInstruction = "Eres Wyz, un Director de Juego personal, amigable y motivador. Tu objetivo es guiar al usuario a través de una configuración inicial para gamificar sus metas. Sigue este flujo: 1. Pregunta su nombre. 2. Después de que respondan, salúdalos por su nombre y pregúntales sobre su objetivo principal. 3. Una vez que especifiquen su objetivo, haz preguntas de sondeo para entenderlo mejor, puedes pedirles que adjunten documentos o imágenes si ayuda. 4. Cuando sientas que tienes suficiente información, di exactamente la frase: 'Perfecto. He diseñado un plan de misiones inicial para ti. ¿Listo para empezar?' y nada más. Sé conciso y mantén un tono de aventura. No uses markdown.";
const generalChatSystemInstruction = "Eres Wyz, un Director de Juego personal y el asesor IA de la app WYD. Tu tono es motivador y amigable. Ya conoces al usuario (te dirán su nombre) y su plan de misiones. Tu objetivo es ayudarles a ajustar su plan, darles consejos de productividad y motivarlos a completar sus misiones. Si te piden añadir una nueva meta, ayúdales a definirla. Refiérete a sus tareas como 'misiones' y a sus metas como 'aventuras'.";


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
          description: { type: Type.STRING, description: "Una descripción de 1 frase de la misión." },
          completed: { type: Type.BOOLEAN, description: "Siempre debe ser `false` inicialmente." },
          verificationType: { 
            type: Type.STRING, 
            description: "El método de verificación. Usa 'manual' para tareas simples (ej. 'Ordenar apuntes'). Usa 'focus_mode' para tareas de estudio/concentración (ej. 'Estudiar 1h')." 
          },
          rewardXP: { type: Type.INTEGER, description: "Puntos de experiencia ganados por la misión, ej. 50 o 100." },
          rewardCoins: { type: Type.INTEGER, description: "Monedas ganadas. IMPORTANTE: Las misiones 'manual' deben dar 0 monedas para evitar fraudes." }
        },
        required: ["level", "title", "completed", "verificationType", "rewardXP", "rewardCoins", "description"]
      }
    }
  },
  required: ["title", "description", "missions"]
};

export const generateMissionPlan = async (history: Message[]): Promise<MissionPlan> => {
    const planGenerationInstruction = "Actúa como un diseñador de juegos experto. Basándote en toda la conversación anterior, crea un plan de misiones inicial para el usuario. El plan debe consistir en un título temático para la aventura, una breve descripción y una lista de exactamente 5 misiones accionables y secuenciales que ayuden al usuario a alcanzar su objetivo. Responde únicamente con el objeto JSON estructurado.";
    
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
        
        const plan = JSON.parse(response.text) as MissionPlan;
        
        if (!plan.title || !plan.missions || plan.missions.length !== 5) {
            throw new Error("El plan generado por la IA no es válido.");
        }
        
        return plan;
    } catch (error) {
        console.error("Error generating mission plan with Gemini:", error);
        return {
            title: "Misión de Rescate",
            description: "Recupera tu plan de aventura.",
            missions: [
                { level: 1, title: "Revisar la conexión con la IA", description: "Asegúrate de que todo funciona.", completed: false, verificationType: 'manual', rewardXP: 10, rewardCoins: 0 },
                { level: 2, title: "Reintentar la creación del plan", description: "Vuelve a intentarlo.", completed: false, verificationType: 'manual', rewardXP: 10, rewardCoins: 0 },
                { level: 3, title: "Contactar al soporte si el problema persiste", description: "Pide ayuda si es necesario.", completed: false, verificationType: 'manual', rewardXP: 10, rewardCoins: 0 },
                { level: 4, title: "Definir una meta simple manualmente", description: "Establece un objetivo simple.", completed: false, verificationType: 'manual', rewardXP: 10, rewardCoins: 0 },
                { level: 5, title: "Completar la primera meta manual", description: "¡Da el primer paso!", completed: false, verificationType: 'manual', rewardXP: 50, rewardCoins: 0 },
            ]
        };
    }
};

export const createGeneralChatSession = (appState: AppState, history: Message[]): Chat => {
    const startupHistory: Content[] = [
        ...mapMessagesToGeminiContent(history),
        {
            role: 'model',
            parts: [{ text: `(Contexto del sistema: El nombre del usuario es ${appState.userName}. Su plan de misiones actual es: ${JSON.stringify(appState.missionPlan)}. No menciones este contexto a menos que sea relevante para su pregunta.)` }]
        }
    ];

    return ai.chats.create({
        model: conversationalModel,
        config: {
            systemInstruction: generalChatSystemInstruction,
        },
        history: startupHistory
    });
};