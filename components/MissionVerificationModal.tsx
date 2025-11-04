import React from 'react';
import type { Mission } from '../types';
import { useAppContext } from '../App';

interface MissionVerificationModalProps {
    mission: Mission;
    onClose: () => void;
}

const MissionVerificationModal: React.FC<MissionVerificationModalProps> = ({ mission, onClose }) => {
    const { handleCompleteMission } = useAppContext();

    const handleManualComplete = () => {
        handleCompleteMission(mission.level);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-2">{mission.title}</h2>
                <p className="text-sm text-slate-600 mb-4">{mission.description}</p>
                
                <div className="bg-slate-100 p-3 rounded-lg mb-6">
                    <p className="font-semibold text-slate-800">Recompensa:</p>
                    <p className="text-sm text-slate-600">
                        <span className="font-bold text-sky-600">{mission.rewardXP} XP</span>
                        {mission.rewardCoins > 0 && ` | <span className="font-bold text-yellow-500">${mission.rewardCoins} 🪙</span>`}
                    </p>
                </div>

                {mission.verificationType === 'manual' && (
                    <>
                        <p className="text-xs text-slate-500 mb-4">Esta misión se basa en el sistema de honor. ¡Completa la tarea y márcala como hecha!</p>
                        <button 
                            onClick={handleManualComplete}
                            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 rounded-lg text-white font-semibold transition-colors"
                        >
                            Marcar como completado (Solo XP)
                        </button>
                    </>
                )}

                {mission.verificationType === 'focus_mode' && (
                    <>
                        <p className="text-xs text-slate-500 mb-4">Para ganar Monedas, debes usar el "Modo Enfoque". Ve al Dashboard para iniciar el temporizador.</p>
                        <button 
                            onClick={onClose} // Simply closes the modal, user needs to go to dashboard
                            className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-semibold transition-colors"
                        >
                            Entendido
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MissionVerificationModal;