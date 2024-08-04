'use client'

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { initState, resetFinish, selectBoard, setFinish, visit } from "@/lib/slices/board"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import BoardGame from "../board"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { MenuIcon } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatTime } from "@/lib/utils"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import * as actions from '@/actions'
import { useToast } from "../ui/use-toast"

interface GameProps {
    paths: number[][] | null;
    setPaths: Dispatch<SetStateAction<number[][] | null>>;
    setSettingsOn: Dispatch<SetStateAction<boolean>>;
}

let index = 0;

export default function Game({ paths = null, setPaths, setSettingsOn }: GameProps) {

    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const gameState = useAppSelector(selectBoard);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const timerGame = useRef<NodeJS.Timeout | null>(null);

    const [isStartBot, setIsStartBot] = useState(false);
    const [time, setTime] = useState(0);

    if (gameState.isFinished) {
        dispatch(setFinish({ isFinished: true, currentTime: time }))
        handleFinished();
    }

    function handleFinished() {
        if (timerGame.current) clearInterval(timerGame.current);
        if (timer.current) clearInterval(timer.current);
    }

    function handleNewBoard() {
        handleFinished();
        setPaths(null);
        setSettingsOn(true);
        dispatch(initState());
        setTime(0);
        setIsStartBot(false);
    }

    async function sendData() {
        let mode = gameState.mode;
        if (mode.startsWith('manual')) {
            mode = 'manual';
        }
        const resnum = await actions.createGameHistory(gameState.currentTime, mode, gameState.level);
        if (resnum == -1 ) {
            toast({
                title: 'Successfully saved',
                description: 'Your history has been saved.',
            })
        } else if (resnum == 0) {
            toast({
                title: 'Your history is not saved',
                description: 'You need to be authenticated to save your history.',
                variant:'destructive'
            })
        } else {
            toast({
                title: 'Your history is not saved',
                description: 'Something went wrong.',
                variant:'destructive'
            })
        }
    }

    useEffect(() => {
        timerGame.current = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => {
            if (timerGame.current) clearInterval(timerGame.current);
        }
    }, [])

    useEffect(() => {
        if (isStartBot) {
            timer.current = setInterval(() => {
                index++;
                length = paths?.length || 0;
                if (paths && index < length) {
                    dispatch(visit({ row: paths[index][0], col: paths[index][1] }))
                } else {
                    if (timer.current) {
                        clearInterval(timer.current);
                    }
                }
            }, 200);
        } else {
            if (timer.current) {
                clearInterval(timer.current);
                index = 0;
            }
        }

        return () => {
            if (timer.current) clearInterval(timer.current);
            index = 0;
        }
    }, [isStartBot])

    return <section className="w-full flex flex-col my-10 justify-center items-center">
        <div className="flex flex-row gap-3 mb-5">
            <Popover>
                <PopoverTrigger asChild>
                    <Button><MenuIcon /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                    <div className="flex flex-col my-1 mx-3">
                        <Button className="w-[150px]" onClick={() => {
                            handleNewBoard();
                        }}>New Board</Button>
                    </div>
                </PopoverContent>
            </Popover>
            {gameState.mode === 'bot' && paths && <>
                <Button onClick={() => {
                    setIsStartBot(prev => !prev)
                }}>{isStartBot ? 'Stop & Reset Bot' : 'Start Bot'}</Button>
            </>}
        </div>
        <BoardGame />
        <p><strong>{formatTime(time)}</strong></p>
        <AlertDialog open={gameState.isFinished}>
            <AlertDialogContent className="max-w-[220px]">
                <AlertDialogHeader >
                    <AlertDialogTitle className="text-center">You Win</AlertDialogTitle>
                    <h2 className="text-center text-lg">Time: <strong>{formatTime(gameState.currentTime)}</strong></h2>
                    <Button onClick={() => {
                        sendData();
                        handleNewBoard();
                    }}>New Board</Button>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    </section>
}