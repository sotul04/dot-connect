import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function HomeUser() {

    const session = await getServerSession(authOptions);

    let content: React.ReactNode;
    if (session?.user) {
        content = <>
            <h1 className="text-5xl font-semibold my-4">Hello, <strong>{session.user.username.toUpperCase()}</strong></h1>
            <p className="font-mono font-bold text-xl my-3">What are you waiting?</p>
            <Link href="/game" className={buttonVariants({ variant: 'default', size: 'lg' }) + " text-xl"}>Let&apos;s Play</Link>
        </>
    } else {
        content = <>
            <h1 className="text-5xl font-semibold my-4">Hello</h1>
            <p className="font-mono font-bold text-xl my-3">If you don&apos;t have an accout, let&apos;s create one!</p>
            <Link href="/new-game" className={buttonVariants()}>Create</Link>
            <p className="font-mono font-bold text-xl my-3">Or do you already have?</p>
            <Link href="/load-game" className={buttonVariants()}>Load Game</Link>
        </>
    }

    return content;
}