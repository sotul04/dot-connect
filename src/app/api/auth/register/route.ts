import { NextResponse } from "next/server";
import db from "@/db";
import { hash } from "bcrypt";
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

        if (existingUser) {
            return NextResponse.json({
                user: null, message: "User with this username is already exists"
            }, {status: 409});
        }

        const hashPassword = await hash(password, 10);

        const newUser = await db.user.create({
            data: {
                username,
                password: hashPassword,
            }
        })

        const {password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({
            user: rest
        }, {status: 201});
    } catch (error) {
        return NextResponse.json({
            message: 'Something went wrong.'
        }, {status: 409})
    }
}