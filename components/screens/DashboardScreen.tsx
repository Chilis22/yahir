import React, { useState, lazy, Suspense } from 'react';
import { useAppContext } from '../../App';

const FocusModeScreen = lazy(() => import('./FocusModeScreen'));

const MapLevel: React.FC<{ level: number, mission: string, isCurrent: boolean, isCompleted: boolean }> = ({ level, mission, isCurrent, isCompleted }) => {
    const statusClasses = isCurrent 
        ? 'bg-sky-500 text-white ring-4 ring-sky-300 ring-opacity-50' 
        : isCompleted 
        ? 'bg-green-500 text-white'
        : 'bg-slate-300 text-slate-700';

    return (
        <div className="relative flex items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl z-10 shadow-lg ${statusClasses}`}>
                {isCompleted ? '✓' : level}
            </div>
            <div className="ml-4 p-3 bg-slate-100 rounded-lg shadow-md flex-1">
                <p className="font-semibold text-slate-800">{mission}</p>
                {isCurrent && <p className="text-xs text-sky-600 font-semibold">Misión Actual</p>}
            </div>
        </div>
    );
};

const PathSegment = () => (
    <div className="h-12 w-1.5 bg-slate-300 ml-7 my-1 rounded-full"></div>
);

const DashboardScreen = () => {
    const { appState } = useAppContext();
    const { missionPlan } = appState;
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    if (!missionPlan) {
        return (
            <div className="text-center p-10 bg-white border border-slate-200 rounded-lg">
                <p className="text-slate-500">No se ha encontrado ningún plan de misiones. ¡Completa la introducción para empezar tu aventura!</p>
            </div>
        );
    }
    
    const currentLevelIndex = missionPlan.missions.findIndex(m => !m.completed);

    return (
        <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-md">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{missionPlan.title}</h2>
                <p className="text-slate-600">{missionPlan.description}</p>
            </div>
            
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
                 <div className="flex flex-col">
                    {missionPlan.missions.map((mission, index) => (
                        <React.Fragment key={mission.level}>
                            <MapLevel 
                                level={mission.level} 
                                mission={mission.title} 
                                isCurrent={index === currentLevelIndex} 
                                isCompleted={mission.completed} 
                            />
                            {index < missionPlan.missions.length - 1 && <PathSegment />}
                        </React.Fragment>
                    ))}
                 </div>
            </div>

            <div className="text-center">
                <button 
                    onClick={() => setIsFocusModeOpen(true)}
                    className="bg-sky-100 text-sky-800 p-3 rounded-lg text-sm font-semibold w-full hover:bg-sky-200 transition-colors"
                >
                    Modo Enfoque
                </button>
            </div>
            
            <Suspense fallback={<div className="text-center p-4">Cargando Modo Enfoque...</div>}>
                {isFocusModeOpen && <FocusModeScreen onClose={() => setIsFocusModeOpen(false)} />}
            </Suspense>
        </div>
    );
};

export default DashboardScreen;