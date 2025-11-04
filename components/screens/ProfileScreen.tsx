import React from 'react';
import { useAppContext } from '../../App';
import { ProfileIcon } from '../../constants';

const ProfileScreen = () => {
    const { appState, handleLogout } = useAppContext();
    const { userName, level, xp, xpToNextLevel, coins, missionPlan } = appState;

    const xpPercentage = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                    <ProfileIcon className="w-12 h-12 text-sky-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{userName || 'Aventurero'}</h2>
                <p className="font-semibold text-slate-500">Nivel {level}</p>
            </div>

             <div className="bg-white border border-slate-200 rounded-xl p-4">
                 <h3 className="text-sm font-semibold text-slate-800 mb-2">Progreso de Nivel</h3>
                 <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                </div>
                <p className="text-xs text-right text-slate-500 mt-1">{xp} / {xpToNextLevel} XP</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
                 <h3 className="text-lg font-semibold text-slate-800 mb-3">Estadísticas</h3>
                 <div className="grid grid-cols-3 gap-4 text-center">
                     <div>
                         <p className="text-2xl font-bold text-sky-600">{missionPlan?.missions.filter(m => m.completed).length || 0}</p>
                         <p className="text-sm text-slate-500">Completadas</p>
                     </div>
                      <div>
                         <p className="text-2xl font-bold text-sky-600">{missionPlan?.missions.length || 0}</p>
                         <p className="text-sm text-slate-500">Totales</p>
                     </div>
                     <div>
                         <p className="text-2xl font-bold text-yellow-500">{coins}</p>
                         <p className="text-sm text-slate-500">Monedas 🪙</p>
                     </div>
                 </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                <button className="w-full flex items-center space-x-3 p-4 text-left text-slate-800 hover:bg-slate-50">
                    <span className="font-semibold">Tienda (Personalizar Héroe)</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-left text-slate-800 hover:bg-slate-50">
                    <span className="font-semibold">Recompensas (Cupones)</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-left text-slate-800 hover:bg-slate-50">
                    <span className="font-semibold">Configuración</span>
                </button>
            </div>

             <div className="bg-white border border-slate-200 rounded-xl">
                <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 p-4 text-left text-red-500 hover:bg-red-50">
                    <span className="font-semibold">Cerrar Sesión</span>
                </button>
            </div>

        </div>
    );
};

export default ProfileScreen;