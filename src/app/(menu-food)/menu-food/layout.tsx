"use client"

import { Inter } from "next/font/google";
import { SessionProvider, GetSessionParams } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderUser } from "../../../../context/dataSessionProvider";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <SessionProvider >
            <div className={inter.className}>
                <SessionProviderUser>
                    {children}
                </SessionProviderUser>
                <Toaster />
            </div>
        </SessionProvider>
    );
}
