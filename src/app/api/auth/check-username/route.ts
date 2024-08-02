// // pages/api/auth/check-username.ts

// import { NextApiRequest, NextApiResponse } from 'next';
// import db from '@/db';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const { username } = req.query;

//     const user = await db.user.findUnique({
//         where: { username: String(username) }
//     });

//     if (user) {
//         res.status(200).json({ isAvailable: false });
//     } else {
//         res.status(200).json({ isAvailable: true });
//     }
// }

// // src/app/api/auth/check-username/route.ts

import { NextResponse } from 'next/server';
import db from '@/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
    
        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }
    
        const user = await db.user.findUnique({
            where: { username }
        })

        if (user) {
            return NextResponse.json({isAvailable: false}, {status: 200})
        } else {
            return NextResponse.json({isAvailable: true}, {status: 200})
        }
    } catch (error) {
        return NextResponse.json({
            message: 'Something went wrong.'
        }, { status: 409 });
    }

}
