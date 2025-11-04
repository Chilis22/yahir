import React, { useState } from 'react';
import { useAppContext } from '../../App';
import type { Mission } from '../../types';
import MissionVerificationModal from '../MissionVerificationModal';

const MissionsScreen = () => {
    const { appState } = useAppContext();
    const { missionPlan } = appState;
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

    if (!missionPlan) {
        return <div className="text-center text-slate-500">No hay misiones disponibles.</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Lista de Misiones</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                {missionPlan.missions.map(mission => (
                    <div 
                        key={mission.level} 
                        onClick={() => !mission.completed && setSelectedMission(mission)}
                        className={`flex items-center p-3 bg-slate-100 rounded-lg transition-colors ${!mission.completed ? 'cursor-pointer hover:bg-slate-200' : 'opacity-60'}`}
                    >
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 mr-4 flex items-center justify-center text-white font-bold ${mission.completed ? 'bg-green-500' : 'border-2 border-slate-400'}`}>
                            {mission.completed && '✓'}
                        </div>
                        <span className={`flex-1 ${mission.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {mission.title}
                        </span>
                    </div>
                ))}
            </div>
             <p className="text-xs text-center text-slate-500">Toca una misión para ver los detalles de finalización.</p>
             
            {selectedMission && (
                <MissionVerificationModal
                    mission={selectedMission}
                    onClose={() => setSelectedMission(null)}
                />
            )}
        </div>
    );
};

export default MissionsScreen;