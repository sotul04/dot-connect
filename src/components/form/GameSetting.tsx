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

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectBoard, setMode, ModeProps, setLevel } from "@/lib/slices/board";
import UserInputBoard from "./UserInputBoard";
import { Dispatch, SetStateAction, useState } from "react";
import ManualForm from "./ManualGameForm";
import { Button } from "../ui/button";
import { getLevel } from "@/lib/utils";

interface SettingsProps {
    setSettingsOn: Dispatch<SetStateAction<boolean>>
}

export default function GameSetting( { setSettingsOn }: SettingsProps) {

    const gameState = useAppSelector(selectBoard);
    const dispatch = useAppDispatch();

    const [boardUploaded, setBoardUploaded] = useState<number[][] | null>(null);
    const [errorBoardMessage, setErrorBoardMessage] = useState<string | null>(null);

    let modeContent: React.ReactNode;
    if (gameState.mode.startsWith('manual')) {
        modeContent = <ManualForm setUploadBoard={setBoardUploaded}/>
    } else {
        modeContent = <UserInputBoard setUploadBoard={setBoardUploaded}/> //bot mode
    }

    function handlePlay() {
        if (gameState.mode === 'manual-custom' || gameState.mode === 'bot') {
            if (!boardUploaded) {
                setErrorBoardMessage('You have not upload your board.');
                return;
            }
            const row = boardUploaded.length;
            const col = boardUploaded[0].length;
            if (getLevel({row, col}) !== gameState.level) {
                setErrorBoardMessage('The board\'s dimension you uploaded doesn\'t match the level\'s dimension.');
                return;
            }
        } else {
            // TODO: generate random board
        }
        setErrorBoardMessage(null);
        setBoardUploaded(null);
        setSettingsOn(false);
    }

    return <div className='h-screen flex items-center justify-center'>
        <div className='p-10 rounded-md border'>
            <div className="container my-4">
                <Label>Select Mode</Label>
                <Select onValueChange={(value) => {
                    if (gameState.mode === 'manual-custom' && value === 'manual-random') {
                        return;
                    }
                    dispatch(setMode({ mode: value }))
                }}>
                    <SelectTrigger className="w-[220px] ">
                        <SelectValue placeholder="Manual" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="manual-random" >Manual</SelectItem>
                            <SelectItem value="bot" >Bot</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {modeContent}
            <div className="container my-4">
                <Label>Select Level</Label>
                <Select onValueChange={(value) => dispatch(setLevel({ level: value }))}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Beginner" />
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
            </div>
            <div className="container my-4 flex justify-center">
            <p className="max-w-[300px] text-center text-sm text-red-500">{errorBoardMessage}</p>
            </div>
            <div className="flex justify-center">
                <Button className="mt-4" onClick={handlePlay}>Play</Button>
            </div>
        </div>
    </div>
}