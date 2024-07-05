import { json } from "stream/consumers"
import { auth } from "../../../auth"


export default async function Dashboard() {
    const session = await auth()
    return <p>
        {JSON.stringify(session)}
    </p>
}