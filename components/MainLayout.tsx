import React, { useState, lazy, Suspense } from 'react';
import type { Screen } from '../types';
import {
    DashboardIcon,
    MissionsIcon,
    CommunityIcon,
    ProfileIcon,
    AiIcon
} from '../constants';

// Lazy load screens for better performance
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const MissionsScreen = lazy(() => import('./screens/MissionsScreen'));
const CommunityScreen = lazy(() => import('./screens/CommunityScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const Chatbot = lazy(() => import('./Chatbot'));


const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${isActive ? 'text-sky-500' : 'text-slate-500 hover:text-slate-900'}`}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const BottomNavBar: React.FC<{
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}> = ({ activeScreen, setActiveScreen }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto flex justify-around items-center">
                <NavItem
                    icon={<DashboardIcon className="w-6 h-6" />}
                    label="Dashboard"
                    isActive={activeScreen === 'dashboard'}
                    onClick={() => setActiveScreen('dashboard')}
                />
                <NavItem
                    icon={<MissionsIcon className="w-6 h-6" />}
                    label="Misiones"
                    isActive={activeScreen === 'missions'}
                    onClick={() => setActiveScreen('missions')}
                />
                <NavItem
                    icon={<CommunityIcon className="w-6 h-6" />}
                    label="Comunidad"
                    isActive={activeScreen === 'community'}
                    onClick={() => setActiveScreen('community')}
                />
                <NavItem
                    icon={<ProfileIcon className="w-6 h-6" />}
                    label="Perfil"
                    isActive={activeScreen === 'profile'}
                    onClick={() => setActiveScreen('profile')}
                />
            </div>
        </nav>
    );
};


const MainLayout: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
    const [isChatOpen, setIsChatOpen] = useState(false);

    const renderScreen = () => {
        switch (activeScreen) {
            case 'dashboard':
                return <DashboardScreen />;
            case 'missions':
                return <MissionsScreen />;
            case 'community':
                return <CommunityScreen />;
            case 'profile':
                return <ProfileScreen />;
            default:
                return <DashboardScreen />;
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-50 pb-20">
            <header className="p-4 text-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">WYD</h1>
            </header>
            
            <main className="p-4">
                 <Suspense fallback={<div className="text-center p-10 text-slate-500">Cargando Aventura...</div>}>
                    {renderScreen()}
                 </Suspense>
            </main>

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg flex items-center justify-center text-white transition-transform transform hover:scale-110"
                aria-label="Abrir Asistente IA"
            >
                <AiIcon className="w-8 h-8" />
            </button>
            
            <Suspense fallback={null}>
                {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
            </Suspense>

            <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
    );
};

export default MainLayout;