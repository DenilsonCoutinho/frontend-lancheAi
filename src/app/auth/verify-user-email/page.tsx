"use client";
import { Button } from "@/components/ui/button";
import { verifyToken } from "../../../../actions/auth/verify-user-email";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


const EmailVerificationForm = () => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [data, setdata] = useState<[] | any>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter()
    const [loading, setLoading] = useState<boolean | undefined>(false);
    const { toast } = useToast()

    const automaticSubmission = async () => {
        setLoading(true)
        if (!searchParams || !searchParams.has("token")) return null;

        if (errorMessage || successMessage) return;

        if (!token) {
            setErrorMessage("Token inválido");
            return;
        }


        const { error, success } = await verifyToken(token)
        if (success) {
            toast({
                title: success,
                description: "Verificação concluida com sucesso!",
                action: <ToastAction altText="tente novamente">ok</ToastAction>,
                className: "bg-green-500 relative text-white",

            })
            await new Promise(resolve => (setTimeout(resolve, 3000)))
        } else {
            toast({
                title: error,
                description: ":(",
                action: <ToastAction altText="tente novamente">ok</ToastAction>,
                className: "bg-green-500 relative text-white",

            })
        }
        setLoading(false)

    }

    useEffect(() => {
        automaticSubmission();
    }, []);
    return (
        <div className="flex min-h-screen flex-1 justify-center items-center">
            <div className="flex rounded-2xl justify-center items-center flex-col  ">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Email verificado com sucesso!</CardTitle>
                    </CardHeader>
                    <CardFooter className=" flex-col items-center">
                        <Button onClick={() => router.push("/auth/login")} disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">
                            <LoaderIcon className={!loading ? "hidden" : "animate-spin mr-2"} />
                            Voltar</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerificationForm;