// En components/screens/CommunityScreen.tsx

import React from 'react';
import { useAppContext } from '../../App'; // Importar el contexto
import { CommunityIcon, ProfileIcon } from '../../constants'; // Importar iconos

// Plantilla de una publicación
const Post: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-start space-x-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-sm text-slate-700">
                {children}
            </p>
            {/* Botones falsos de interacción */}
            <div className="flex space-x-4 mt-3">
                <button className="text-xs font-semibold text-slate-500 hover:text-sky-600">Reaccionar</button>
                <button className="text-xs font-semibold text-slate-500 hover:text-sky-600">Comentar</button>
            </div>
        </div>
    </div>
);

const CommunityScreen = () => {
    // Obtenemos el estado global de la app
    const { appState } = useAppContext();
    const { userName, missionPlan } = appState;

    // Usamos el nombre del usuario o 'Aventurero' si es nulo
    const name = userName || 'Aventurero';
    
    // Usamos el título del plan (ej. "La Senda del Atleta") o un plan genérico
    const planTitle = missionPlan?.title || 'Reto de Bienestar';
    
    // Usamos la primera misión del plan o una misión genérica
    const firstMission = missionPlan?.missions[0]?.title || 'Completar el primer paso';

    return (
        <div className="space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Comunidad</h2>
                <p className="text-slate-600">Tu red de apoyo para la aventura.</p>
            </div>
            
            {/* Pestañas falsas para la mini red social */}
            <div className="flex space-x-2">
                <button className="flex-1 py-2 px-3 bg-sky-600 text-white rounded-lg font-semibold">Global</button>
                <button className="flex-1 py-2 px-3 bg-slate-200 text-slate-700 rounded-lg font-semibold">Mis Grupos</button>
                <button className="flex-1 py-2 px-3 bg-slate-200 text-slate-700 rounded-lg font-semibold">Competencias</button>
            </div>

            {/* El Feed Inteligente Simulado */}
            <div className="space-y-4">
                
                {/* Publicación 1: Personalizada con el Plan del Usuario */}
                <Post icon={<CommunityIcon className="w-6 h-6" />}>
                    ¡El grupo <span className="font-semibold text-sky-600">"{planTitle}"</span> acaba de iniciar una nueva meta conjunta! ¿Quién se une al desafío?
                </Post>
                
                {/* Publicación 2: Genérica (para que parezca que hay más gente) */}
                <Post icon={<ProfileIcon className="w-6 h-6" />}>
                    <span className="font-semibold text-slate-900">Ana</span> ha completado la misión "Correr 5k" y ha ganado la insignia "Racha de 3 Días". ¡Felicidades!
                </Post>
                
                {/* Publicación 3: Personalizada con el Nombre del Usuario */}
                <Post icon={<ProfileIcon className="w-6 h-6" />}>
                    ¡Demos la bienvenida a <span className="font-semibold text-slate-900">{name}</span>, que acaba de unirse al desafío <span className="font-semibold text-sky-600">"{planTitle}"</span>! Su primera misión es: "{firstMission}".
                </Post>

                {/* Publicación 4: Genérica */}
                <Post icon={<ProfileIcon className="w-6 h-6" />}>
                    <span className="font-semibold text-slate-900">Carlos</span> está buscando compañeros para la meta "Terminar Proyecto Final".
                </Post>
            </div>
        </div>
    );
};

export default CommunityScreen;