import Link from "next/link";
import LeaderBoard from "@/components/common/leader-board";
import AuthUser from "./auth-user";
import Image from "next/image";

export default async function Header() {
    return <header className="py-2 border-b w-full">
        <div className="container flex gap -3 items-center justify-between">
            <div className="flex gap-3 items-center justify-evenly">
                <Link href="/" className="flex gap-2 ">
                    <Image src="/connections.png" alt="dot-connect" width={30} height={30} />
                    <h3 className="text-xl">Dot Connect</h3>
                </Link>
                <LeaderBoard />
            </div>
            <AuthUser />
        </div>
    </header>
}