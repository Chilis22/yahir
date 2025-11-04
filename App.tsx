import React, { useState, createContext, useContext, useMemo, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import OnboardingChat from './components/OnboardingChat';
import MainLayout from './components/MainLayout';
import type { AppState, MissionPlan, Post, Mission } from './types';
import { ProfileIcon } from './constants';

const initialAppState: AppState = {
    userName: null,
    missionPlan: null,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    coins: 0,
    posts: [
        { id: 1, user: 'Yahir', action: 'ha completado la misión "Estudiar 1h Cálculo"!', icon: <ProfileIcon className="w-5 h-5"/> },
        { id: 2, user: 'Mentor', action: 'ha iniciado una meta grupal: "Terminar Proyecto Final"', icon: <ProfileIcon className="w-5 h-5"/> },
    ]
};

interface AppContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    handleLogout: () => void;
    handleCompleteMission: (missionLevel: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [appState, setAppState] = useState<AppState>(initialAppState);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    
    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setIsOnboardingComplete(false);
        setAppState(initialAppState);
    }, []);

    const handleOnboardingComplete = (name: string, plan: MissionPlan) => {
        setAppState(prev => ({ ...prev, userName: name, missionPlan: plan }));
        setIsOnboardingComplete(true);
    };
    
    const handleCompleteMission = useCallback((missionLevel: number) => {
        setAppState(prev => {
            if (!prev.missionPlan) return prev;

            let missionToComplete: Mission | undefined;
            const updatedMissions = prev.missionPlan.missions.map(m => {
                if (m.level === missionLevel) {
                    missionToComplete = m;
                    return { ...m, completed: true };
                }
                return m;
            });

            if (!missionToComplete) return prev;

            let newXp = prev.xp + missionToComplete.rewardXP;
            let newLevel = prev.level;
            let newXpToNextLevel = prev.xpToNextLevel;
            
            // Handle level up
            if (newXp >= newXpToNextLevel) {
                newLevel += 1;
                newXp = newXp - newXpToNextLevel; // Carry over remaining XP
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5); // Increase XP requirement for next level
            }
            
            // Add new community post
            const newPost: Post = {
                id: Date.now(),
                user: prev.userName || 'Aventurero',
                action: `ha completado la misión: "${missionToComplete.title}"!`,
                icon: <ProfileIcon className="w-5 h-5" />
            };

            return {
                ...prev,
                missionPlan: { ...prev.missionPlan, missions: updatedMissions },
                xp: newXp,
                level: newLevel,
                xpToNextLevel: newXpToNextLevel,
                coins: prev.coins + missionToComplete.rewardCoins,
                posts: [newPost, ...prev.posts]
            };
        });
    }, []);

    const contextValue = useMemo(() => ({ appState, setAppState, handleLogout, handleCompleteMission }), [appState, handleLogout, handleCompleteMission]);

    const renderContent = () => {
        if (!isLoggedIn) {
            return <LoginScreen onLogin={handleLogin} />;
        }
        if (!isOnboardingComplete) {
            return <OnboardingChat onComplete={handleOnboardingComplete} />;
        }
        return <MainLayout />;
    };

    return (
        <AppContext.Provider value={contextValue}>
            {renderContent()}
        </AppContext.Provider>
    );
};

export default App;