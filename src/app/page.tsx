import { redirect } from "next/navigation";
import { auth } from "../../auth";
import Dashboard from "./dashboard/page";

export default async function Home() {

    const session = await auth()
    if (!session?.user) {
        redirect("/auth/login");
    } else {
        redirect("/dashboard");
    }
    return (

        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Dashboard />
        </main>
    );
}
