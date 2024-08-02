import { NextResponse } from "next/server";
import db from "@/db";
import { compare, hash } from "bcrypt";
import {z} from 'zod';

interface UserData {
    username: string,
    password: string
}

const userSchema = z.object({
    username: z.string().min(1, 'Name is required.').max(100),
    password: z.string().min(1, 'Password is required.').min(8, 'Password must have at least 8 characters.'),
});

export async function POST(req: Request) {
    try{
        const body: UserData = await req.json();
        const {username, password} = userSchema.parse(body);

        const existingUser = await db.user.findUnique({
            where: {
                username
            }
        });

        if (!existingUser) {
            return NextResponse.json({
                user: null, message: "Account with username is not exists."
            }, {status: 200});
        }

        const passwordMatch = await compare(password, existingUser.password);

        if (!passwordMatch) {
            return NextResponse.json({
                user: null, message: "The password do not match."
            }, {status: 200});
        }

        return NextResponse.json({
            user: {
                id: existingUser.id,
                username: existingUser.username
            }
        }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            message: 'Something went wrong.'
        }, {status: 409})
    }
}