import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from '../auth';

interface SessionProps {
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
}

const SessionContext = createContext<SessionProps | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}
import { getSession } from "next-auth/react";

export function SessionProviderUser({ children }: SessionProviderProps) {

    const [id, setId] = useState<string>('');

    async function currentSession() {
        const session = await getSession()
        setId(session?.user?.id as string)
        return
    }

    useEffect(() => {
        currentSession()
    }, [])
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