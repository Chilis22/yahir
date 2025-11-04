import type { Part } from "@google/genai";

export type Sender = 'user' | 'ai';

export type FilePart = Part;

export interface Message {
    sender: Sender;
    text: string;
    file?: FilePart;
    options?: { label: string; value: string }[];
}

export type VerificationType = 'manual' | 'focus_mode' | 'api' | 'social';

export interface Mission {
    level: number;
    title: string;
    completed: boolean;
    description?: string;
    verificationType: VerificationType;
    rewardXP: number;
    rewardCoins: number;
}


export interface MissionPlan {
    title: string;
    description: string;
    missions: Mission[];
}

export interface Post {
    id: number;
    user: string;
    action: string;
    icon: React.ReactNode;
}


export type Screen = 'dashboard' | 'missions' | 'community' | 'profile';

export interface AppState {
    userName: string | null;
    missionPlan: MissionPlan | null;
    level: number;
    xp: number;
    xpToNextLevel: number;
    coins: number;
    posts: Post[];
}