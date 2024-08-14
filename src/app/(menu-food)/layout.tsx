import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "../../../auth";
import { SessionProviderUser } from "../../../context/dataSessionProvider";
import dynamic from 'next/dynamic'


const inter = Inter({ subsets: ["latin"] });

export default async function MenuRootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session} >
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
