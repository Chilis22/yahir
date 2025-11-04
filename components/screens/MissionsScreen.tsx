import React from 'react';
import { useAppContext } from '../../App';

const MissionsScreen = () => {
    const { appState, setAppState } = useAppContext();
    const { missionPlan } = appState;

    if (!missionPlan) {
        return <div className="text-center text-slate-500">No hay misiones disponibles.</div>;
    }

    const toggleMission = (level: number) => {
        if (!missionPlan) return;
        const updatedMissions = missionPlan.missions.map(m => 
            m.level === level ? { ...m, completed: !m.completed } : m
        );
        setAppState(prev => ({
            ...prev,
            missionPlan: { ...missionPlan, missions: updatedMissions }
        }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Lista de Misiones</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                {missionPlan.missions.map(mission => (
                    <div 
                        key={mission.level} 
                        onClick={() => toggleMission(mission.level)}
                        className="flex items-center p-3 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
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
             <p className="text-xs text-center text-slate-500">Toca una misión para marcarla como completada.</p>
        </div>
    );
};

export default MissionsScreen;