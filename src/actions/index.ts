'use server'

import { authOptions } from "@/auth"
import { getServerSession } from "next-auth"
import { Game } from "@prisma/client";
import db from "@/db";

export async function createGameHistory(time: number, mode: string, level: string): Promise<number> {

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return 0;
    }

    try {
        await db.game.create({
            data: {
                userID: parseInt(session.user.id),
                time: time,
                level: level,
                mode: mode
            },
        })
    } catch (error) {
        console.error(error);
        return 1;
    }
    return -1;
}

export async function getGameHistory(mode: string, level: string): Promise<(Game & { user: { username: string } })[]> {
    try {
        const games = await db.game.findMany({
            where: {
                mode: mode,
                level: level
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                time: 'asc'
            },
            take: 5
        });
        return games;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch game history');
    }
}
