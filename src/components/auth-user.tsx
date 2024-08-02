'use client'

import { signOut, selectAuth } from "@/lib/slices/auth"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover';
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

export default function AuthUser() {
    const authUser = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();

    console.log("AUTH USER", authUser);

    let authContent: React.ReactNode;
    if (authUser.isAuthenticated) {
        const name = authUser.username;
        authContent = <Popover>
        <PopoverTrigger>
            <Avatar>
                <AvatarFallback>{name.substring(0, Math.min(1, name.length)).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-[200px]">
            <div className="flex flex-col items-center gap-4">
                <h3>Hello, <strong>{name}</strong></h3>
                <form action={() => dispatch(signOut())}>
                    <Button type="submit" variant="destructive">Sign out</Button>
                </form>
            </div>
        </PopoverContent>
    </Popover>
    } else {
        authContent = <div className="flex gap-3">
            <Link href="/new-game" className={buttonVariants({variant: "outline"})}>New Game</Link>
            <Link href="/load-game" className={buttonVariants({variant: "outline"})}>Load Game</Link>
        </div>
    }

    return authContent;
}