"use client";
import { Button } from "@/components/ui/button";
import { verifyToken } from "../../../../actions/auth/verify-user-email";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { resolve } from "path";


const EmailVerificationForm = () => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [data, setdata] = useState<[] | any>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const automaticSubmission = async () => {
        if (!searchParams || !searchParams.has("token")) return null;

        if (errorMessage || successMessage) return;

        if (!token) {
            setErrorMessage("Token inválido");
            return;
        }


        const { error, success } = await verifyToken(token)
        if (success) {
            setSuccessMessage('VERIFICAÇÃO CONCLUIDA COM SUCESSO!')
            await new Promise(resolve => (setTimeout(resolve, 3000)))
            window.location.href = "http://localhost:3000/auth/login"
        } else {
            setErrorMessage(error)
        }
    }

    useEffect(() => {
        automaticSubmission();
    }, []);
    return (
        <div className="flex min-h-screen flex-1 justify-center items-center">
            <div className="flex rounded-2xl justify-center items-center flex-col border border-slate-300 h-96 w-96">
                <h1 className="text-sm pb-5">
                </h1>
                <h1 className="text-sm pb-5">
                    {successMessage || errorMessage}
                </h1>
                <Link href={'/auth/login'}>
                    <Button>Fazer login</Button>
                </Link>
            </div>
        </div>
    );
};

export default EmailVerificationForm;