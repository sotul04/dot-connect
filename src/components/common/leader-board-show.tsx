'use client'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

export default function LeaderBoardShow() {
    const [level, setLevel] = useState('beginner');

    function handleLevelChange(newLevel: string) {
        if (level === newLevel) {
            return;
        }
        setLevel(newLevel);
    }

    return <div>
        <Select onValueChange={handleLevelChange}>
            <SelectTrigger className="w-[180px]"> 
                <SelectValue placeholder="Beginner"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="beginner" >Beginner</SelectItem>
                    <SelectItem value="easy" >Easy</SelectItem>
                    <SelectItem value="medium" >Medium</SelectItem>
                    <SelectItem value="hard" >Hard</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        <div className=" mt-8 w-[200px] rounded-xl h-[100px] bg-emerald-300">
        </div>

    </div>
}