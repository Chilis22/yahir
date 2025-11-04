import React from 'react';
import { useAppContext } from '../App';
import type { Mission } from '../types';

interface MissionVerificationModalProps {
    mission: Mission;
    onClose: () => void;
}

const MissionVerificationModal: React.FC<MissionVerificationModalProps> = ({ mission, onClose }) => {
    const { handleCompleteMission } = useAppContext();

    const handleConfirm = () => {
        handleCompleteMission(mission.level);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Confirmar Misión</h2>
                <p className="text-slate-600">
                    ¿Estás seguro de que has completado la misión <span className="font-semibold text-slate-800">"{mission.title}"</span>?
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-500">{mission.description}</p>
                </div>
                <div className="pt-2 flex justify-end space-x-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 text-slate-800 hover:bg-slate-300 rounded-lg font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-semibold transition-colors"
                    >
                        Confirmar y Reclamar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionVerificationModal;
