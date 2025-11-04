import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../App';

interface FocusModeScreenProps {
    onClose: () => void;
}

const FOCUS_DURATION_MINUTES = 60;

const FocusModeScreen: React.FC<FocusModeScreenProps> = ({ onClose }) => {
    const { appState, handleCompleteMission } = useAppContext();
    const [isActive, setIsActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(FOCUS_DURATION_MINUTES * 60);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(t => t - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            // Timer finished, complete the mission
            const focusMission = appState.missionPlan?.missions.find(
                m => m.verificationType === 'focus_mode' && !m.completed
            );
            if (focusMission) {
                handleCompleteMission(focusMission.level);
            }
            setIsActive(false);
            onClose(); // Close the modal after completion
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeRemaining, appState.missionPlan, handleCompleteMission, onClose]);

    const handleStart = () => {
        setIsActive(true);
    };
    
    const handleStop = () => {
        setIsActive(false);
        setTimeRemaining(FOCUS_DURATION_MINUTES * 60);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center p-4 text-white animate-fade-in backdrop-blur-sm">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h1 className="text-4xl font-bold mb-4">Modo Enfoque</h1>
            <p className="text-slate-300 mb-12">Concéntrate en tu misión actual sin distracciones.</p>
            
            <div className="text-8xl font-black tracking-tighter mb-12">
                <span>{String(minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(seconds).padStart(2, '0')}</span>
            </div>

            {!isActive ? (
                <button 
                    onClick={handleStart}
                    className="w-full max-w-xs py-4 px-6 bg-sky-500 hover:bg-sky-400 rounded-lg text-white font-bold text-lg transition-colors"
                >
                    Iniciar Sesión de Enfoque
                </button>
            ) : (
                <button 
                    onClick={handleStop}
                    className="w-full max-w-xs py-4 px-6 bg-red-500 hover:bg-red-400 rounded-lg text-white font-bold text-lg transition-colors"
                >
                    Cancelar Sesión
                </button>
            )}
        </div>
    );
};

export default FocusModeScreen;