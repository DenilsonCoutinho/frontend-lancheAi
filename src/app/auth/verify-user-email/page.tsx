"use client";
import { verifyToken } from "../../../../actions/auth/verify-user-email";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { db as prisma } from "@/lib/db";


const EmailVerificationForm = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [data, setdata] = useState<[] | any>();
    const searchParams = useSearchParams();
    // if (!searchParams || !searchParams.has("token")) return null;
    const token = searchParams.get("token");
    const automaticSubmission = useCallback(() => {
        if (error || success) return;

        if (!token) {
            setError("Token inválido");
            return;
        }

        
         verifyToken(token)
        .then((data) => {
            console.log(data);
                setdata(data);
                setSuccess(data.success);
                setError(data.error);
            })
            .catch((error) => {
                setError("Algo deu errado");
            });
    }, [token, success, error]);

    useEffect(() => {
        automaticSubmission();
    }, [automaticSubmission]);
    return (
        <div className="flex flex-1 justify-center items-center">
            {error}
            {success}
        
        </div>
    );
};

export default EmailVerificationForm;