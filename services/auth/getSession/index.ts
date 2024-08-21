import { auth } from "../../../auth";

export default async function CurrentSession() {
    const session = await auth()
    return session?.user
}