import React, { useState, createContext, useContext, useMemo } from 'react';
import LoginScreen from './components/LoginScreen';
import OnboardingChat from './components/OnboardingChat';
import MainLayout from './components/MainLayout';
import type { AppState, MissionPlan } from './types';

interface AppContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
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
    const [appState, setAppState] = useState<AppState>({
        userName: null,
        missionPlan: null,
    });

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleOnboardingComplete = (name: string, plan: MissionPlan) => {
        setAppState({ userName: name, missionPlan: plan });
        setIsOnboardingComplete(true);
    };

    const contextValue = useMemo(() => ({ appState, setAppState }), [appState]);

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
