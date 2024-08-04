'use client'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Game } from "@prisma/client";

import { useEffect, useState } from "react";
import * as actions from '@/actions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatTime } from "@/lib/utils";

export default function LeaderBoardShow() {
    const [level, setLevel] = useState('beginner');
    const [mode, setMode] = useState('manual');
    const [data, setData] = useState<(Game & { user: { username: string } })[]>([]);

    function handleLevelChange(newLevel: string) {
        if (level === newLevel) {
            return;
        }
        setLevel(newLevel);
    }

    function handleModeChange(newMode: string) {
        if (mode === newMode) {
            return;
        }
        setMode(newMode);
    }

    useEffect(() => {
        async function getData() {
            const newData = await actions.getGameHistory(mode, level);
            setData(newData);
        }
        
        getData();
    }, [mode, level])

    return (
        <div >
            <div className="flex justify-between">
                <div>
                    <Label htmlFor="level-select">Choose Level</Label>
                    <Select onValueChange={handleLevelChange}>
                        <SelectTrigger id="level-select" className="w-[150px]">
                            <SelectValue placeholder="Beginner" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="mode-select">Choose Mode</Label>
                    <Select onValueChange={handleModeChange}>
                        <SelectTrigger id="mode-select" className="w-[150px]">
                            <SelectValue placeholder="Manual" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="bot">Bot</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="mt-8">
                {data.length === 0 ? (
                    <p className="text-center text-gray-500">No data available</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((game, index) => (
                                <TableRow key={index}>
                                    <TableCell>{game.user.username}</TableCell>
                                    <TableCell>{formatTime(Number(game.time))}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
