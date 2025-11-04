import React, { useState } from 'react';
import { useAppContext } from '../../App';
import type { Mission } from '../../types';
import MissionVerificationModal from '../MissionVerificationModal';

const MissionItem: React.FC<{ mission: Mission, onVerify: (mission: Mission) => void, isActionable: boolean }> = ({ mission, onVerify, isActionable }) => {
    const { title, description, completed, rewardXP, rewardCoins, verificationType } = mission;

    const canVerify = isActionable && !completed && verificationType === 'manual';

    return (
        <div className={`p-4 rounded-lg border transition-all ${completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`font-bold ${completed ? 'text-green-800 line-through' : 'text-slate-900'}`}>{title}</h3>
                    <p className={`text-sm mt-1 ${completed ? 'text-green-600' : 'text-slate-500'}`}>{description}</p>
                </div>
                {completed ? (
                    <div className="flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded-full">Completada</div>
                ) : (
                    <>
                        {canVerify ? (
                            <button 
                                onClick={() => onVerify(mission)}
                                className="flex-shrink-0 ml-4 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                            >
                                Verificar
                            </button>
                        ) : verificationType === 'focus_mode' ? (
                             <div className="flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">Modo Enfoque</div>
                        ) : !isActionable ? (
                             <div className="flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold text-slate-500 bg-slate-200 rounded-full">Bloqueada</div>
                        ) : null}
                    </>
                )}
            </div>
             <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                <span>Recompensa: <span className="font-bold text-slate-700">{rewardXP} XP</span></span>
                {rewardCoins > 0 && <span>+ <span className="font-bold text-yellow-600">{rewardCoins} 🪙</span></span>}
            </div>
        </div>
    );
};


const MissionsScreen = () => {
    const { appState } = useAppContext();
    const { missionPlan } = appState;
    const [verifyingMission, setVerifyingMission] = useState<Mission | null>(null);

    if (!missionPlan) {
        return (
            <div className="text-center p-10 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-500">No tienes misiones activas. ¡Crea un plan para empezar!</p>
            </div>
        );
    }

    const currentMissionIndex = missionPlan.missions.findIndex(m => !m.completed);

    return (
        <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h2 className="text-xl font-bold text-slate-900">{missionPlan.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{missionPlan.description}</p>
            </div>
            
            <div className="space-y-3">
                {missionPlan.missions.map((mission, index) => (
                    <MissionItem 
                        key={mission.level} 
                        mission={mission} 
                        onVerify={setVerifyingMission} 
                        isActionable={currentMissionIndex === -1 || index === currentMissionIndex}
                    />
                ))}
            </div>

            {verifyingMission && (
                <MissionVerificationModal 
                    mission={verifyingMission}
                    onClose={() => setVerifyingMission(null)}
                />
            )}
        </div>
    );
};

export default MissionsScreen;
