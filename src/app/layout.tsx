import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "../../auth";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lanche Ai",
  description: "O melhor gerenciador de pedidos",
};

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
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
