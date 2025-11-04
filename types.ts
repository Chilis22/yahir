import type { Part } from "@google/genai";

export type Sender = 'user' | 'ai';

export type FilePart = Part;

export interface Message {
    sender: Sender;
    text: string;
    file?: FilePart;
    options?: { label: string; value: string }[];
}

export interface Mission {
    level: number;
    title: string;
    completed: boolean;
}

export interface MissionPlan {
    title: string;
    description: string;
    missions: Mission[];
}

export type Screen = 'dashboard' | 'missions' | 'community' | 'profile';

export interface AppState {
    userName: string | null;
    missionPlan: MissionPlan | null;
}
