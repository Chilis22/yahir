import React, { useState, useEffect, useRef } from 'react';
import type { Message, MissionPlan, FilePart } from '../types';
import { getOnboardingResponse, generateMissionPlan } from '../services/geminiService';
import { fileToGenerativePart } from '../utils';
// FIX: Import SendIcon to resolve reference error.
import { AiIcon, PaperclipIcon, SendIcon } from '../constants';

interface OnboardingChatProps {
    onComplete: (name: string, plan: MissionPlan) => void;
}

const goalOptions = [
    { label: "🎓 Mejorar mis Estudios", value: "mejorar mis estudios" },
    { label: "💪 Mejorar mi Salud Física", value: "mejorar mi salud física" },
    { label: "🧘 Mejorar mi Salud Mental", value: "mejorar mi salud mental" },
    { label: "🧹 Ser más Organizado/a", value: "ser más organizado" },
    { label: "✨ Personalizado", value: "personalizado" },
];

const OnboardingChat: React.FC<OnboardingChatProps> = ({ onComplete }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "¡Bienvenido/a! Soy Wyz, tu Director de Juego personal. Para empezar, ¿cómo te llamas?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [userGoal, setUserGoal] = useState<string | null>(null);
    const [showPlanButton, setShowPlanButton] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const callGeminiAPI = async (history: Message[]) => {
        setIsLoading(true);
        const responseText = await getOnboardingResponse(history);
        const aiMessage: Message = { sender: 'ai', text: responseText };

        // After user gives name, AI should ask for goal. We add the options here.
        if (!userName && history.length === 2) {
            setUserName(history[1].text);
            aiMessage.options = goalOptions;
        }

        // AI signals it's ready to create the plan
        if (responseText.toLowerCase().includes('¿listo para empezar?')) {
            setShowPlanButton(true);
        }

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    }
    
    const handleFinalizePlan = async () => {
        setIsLoading(true);
        const plan = await generateMissionPlan(messages);
        onComplete(userName, plan);
        setIsLoading(false);
    };

    const handleSendMessage = async (text: string, filePart?: FilePart) => {
        if (!text.trim() && !filePart || isLoading) return;

        const userMessage: Message = { sender: 'user', text, file: filePart };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        if(!filePart) setInputValue('');

        await callGeminiAPI(newMessages);
    };

    const handleOptionClick = (value: string, label: string) => {
        setUserGoal(value);
        const userMessage: Message = { sender: 'user', text: label };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        callGeminiAPI(newMessages);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            const filePart = await fileToGenerativePart(file);
            // Allow sending an image with an optional text message
            const textToSend = inputValue || `He adjuntado un archivo: ${file.name}`;
            setInputValue('');
            await handleSendMessage(textToSend, filePart);
        } catch (error) {
            console.error("Error processing file:", error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
            // Reset file input
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 p-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center flex-shrink-0"><AiIcon className="w-5 h-5"/></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                           {msg.file?.inlineData.mimeType.startsWith('image/') && (
                                <img src={`data:${msg.file.inlineData.mimeType};base64,${msg.file.inlineData.data}`} alt="Uploaded content" className="rounded-lg mb-2 max-h-48" />
                           )}
                           <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                           {msg.options && !isLoading && (
                                <div className="mt-3 grid grid-cols-1 gap-2">
                                    {msg.options.map(opt => (
                                        <button key={opt.value} onClick={() => handleOptionClick(opt.value, opt.label)} className="w-full text-left p-2 bg-white hover:bg-sky-100 border border-slate-300 text-slate-700 rounded-lg text-sm transition-colors">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                           )}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center flex-shrink-0"><AiIcon className="w-5 h-5"/></div>
                         <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="mt-4">
                {showPlanButton ? (
                    <button onClick={handleFinalizePlan} disabled={isLoading} className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isLoading ? 'Diseñando tu Aventura...' : '¡Empezar Aventura!'}
                    </button>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="flex items-center space-x-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,application/pdf" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-3 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-500 hover:text-slate-700 transition-colors">
                           <PaperclipIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            disabled={isLoading || (userName && !userGoal)}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                        />
                         <button type="submit" disabled={isLoading || !inputValue.trim()} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-sky-600 hover:bg-sky-700 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <SendIcon className="w-6 h-6"/>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OnboardingChat;