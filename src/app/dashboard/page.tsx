import { redirect } from "next/navigation";
import { auth } from "../../../auth"


export default async function Dashboard() {
    const session = await auth()
    if (session === null){
        redirect("/auth/login");
    }
    return <p>
        {JSON.stringify(session)}
    </p>
}