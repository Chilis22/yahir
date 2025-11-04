import React from 'react';
import { useAppContext } from '../../App';
import { ProfileIcon } from '../../constants';

const ProfileScreen = () => {
    const { appState } = useAppContext();

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                    <ProfileIcon className="w-12 h-12 text-sky-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{appState.userName || 'Aventurero'}</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
                 <h3 className="text-lg font-semibold text-slate-800 mb-3">Estadísticas</h3>
                 <div className="grid grid-cols-2 gap-4 text-center">
                     <div>
                         <p className="text-2xl font-bold text-sky-600">{appState.missionPlan?.missions.filter(m => m.completed).length || 0}</p>
                         <p className="text-sm text-slate-500">Misiones Completadas</p>
                     </div>
                      <div>
                         <p className="text-2xl font-bold text-sky-600">{appState.missionPlan?.missions.length || 0}</p>
                         <p className="text-sm text-slate-500">Misiones Totales</p>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ProfileScreen;