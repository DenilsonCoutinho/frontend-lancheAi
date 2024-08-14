import React, { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '../auth';

interface SessionProps {
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
}

const SessionContext = createContext<SessionProps | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

export async function SessionProviderUser({ children }: SessionProviderProps) {
    const session = await auth()
    const idSession = session?.user?.id as string
    const [id, setId] = useState<string>(idSession);
    return (
        <SessionContext.Provider value={{ id, setId }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionProps(): SessionProps {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionProps deve ser usado dentro de um SessionProviderUser');
    }
    return context;
}