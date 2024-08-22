"use client"
import { getSession } from "next-auth/react"
import { getCategories } from "../api/menu-food/route"
import { useEffect } from "react"

export function MenuOrder(){

    useEffect(() => {
        async function getDataCategories() {
            const dataSession = await getSession()
            const idSession = dataSession?.user?.id as string
            const data = await getCategories(idSession)
            const sortedCategories = data.sort((a:any, b:any) => a?.order - b?.order );
        console.log(sortedCategories)
          
        }
        getDataCategories()
    }, [])
    return(
        <>
        </>
    )
}