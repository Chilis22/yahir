import React, { useState, useEffect, useRef } from 'react';
import { AiIcon, SendIcon } from '../constants';
// CAMBIADO: Importar de geminiService
import { createGeneralChatSession } from '../services/geminiService'; 
import type { Message } from '../types';
import type { Chat } from '@google/genai';
import { useAppContext } from '../App'; // NUEVO: Importar el contexto de la app

interface ChatbotProps {
    onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const { appState } = useAppContext(); // NUEVO: Obtener el estado global

    const [messages, setMessages] = useState<Message[]>([
        // NUEVO: Saludo personalizado
        { sender: 'ai', text: `Hola ${appState.userName || 'Aventurero'}, ¿en qué te puedo ayudar hoy con tu aventura?` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // CAMBIADO: Inicializar el chat CON CONTEXTO
        // Le pasamos el estado actual de la app y un historial vacío.
        setChat(createGeneralChatSession(appState, []));
    }, [appState]); // Se inicializa con el estado actual

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chat) return;

        const userMessage: Message = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);

        try {
            // La lógica de envío de mensajes ahora funciona con el chat contextualizado
            // FIX: The `sendMessage` method expects an object with a `message` property.
            const response = await chat.sendMessage({ message: currentInput });
            const responseText = response.text;
            const aiMessage: Message = { sender: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: Message = { sender: 'ai', text: 'Lo siento, ocurrió un error. Inténtalo de nuevo.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // El JSX del return (el diseño de la ventana del chat) es perfecto.
        // No es necesario cambiar nada en el return.
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in">
            {/* ... (todo el JSX existente se mantiene igual) ... */}
            <div className="bg-white w-full max-w-lg h-[90vh] rounded-t-2xl flex flex-col shadow-2xl border border-slate-200">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <AiIcon className="w-6 h-6 text-sky-500" />
                        <h2 className="text-lg font-bold text-slate-900">Asistente IA (Wyz)</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                    <AiIcon className="w-5 h-5 text-sky-500" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><AiIcon className="w-5 h-5 text-sky-500"/></div>
                             <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-150"></div>
                                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-300"></div>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 flex-shrink-0 bg-white">
                     <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pregúntale algo a Wyz..."
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-sky-600 hover:bg-sky-700 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <SendIcon className="w-6 h-6"/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;