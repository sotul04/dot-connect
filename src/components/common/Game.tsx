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
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatTime } from "@/lib/utils"
import * as actions from '@/actions'
import { useToast } from "../ui/use-toast"

interface GameProps {
    setSettingsOn: Dispatch<SetStateAction<boolean>>;
}

let index = 0;
let paths: number[][] | null = null;

export default function Game({ setSettingsOn }: GameProps) {

    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const gameState = useAppSelector(selectBoard);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const timerGame = useRef<NodeJS.Timeout | null>(null);

    const [isStartBot, setIsStartBot] = useState(false);
    const [time, setTime] = useState(0);
    const [dataSolved, setDataSolved] = useState(false);

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
        paths = null;
        setSettingsOn(true);
        dispatch(initState());
        setTime(0);
        setIsStartBot(false);
        setDataSolved(false);
    }

    async function sendData() {
        let mode = gameState.mode;
        if (mode.startsWith('manual')) {
            mode = 'manual';
        }
        const resnum = await actions.createGameHistory(gameState.currentTime, mode, gameState.level);
        if (resnum == -1) {
            toast({
                title: 'Successfully saved',
                description: 'Your history has been saved.',
            })
        } else if (resnum == 0) {
            toast({
                title: 'Your history is not saved',
                description: 'You need to be authenticated to save your history.',
                variant: 'destructive'
            })
        } else {
            toast({
                title: 'Your history is not saved',
                description: 'Something went wrong.',
                variant: 'destructive'
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
        async function solveBoard() {
            console.log("Try to get solution from server.")
            try {
                const response = await fetch('https://dotconnect-api.vercel.app/solve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'apllication/json',
                    },
                    body: JSON.stringify({
                        board: gameState.board.board
                    })
                })

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        const steps: number[][] = data.path;
                        paths = steps
                        toast({
                            title: "Board solution received",
                            description: `Execution time needed is ${data.time}`
                        })
                        setDataSolved(true);
                    } else {
                        paths = null;
                        toast({
                            title: "Board has no solution",
                            description: `Execution time needed is ${data.time}`
                        })
                        setDataSolved(false);
                    }
                } else {
                    paths = null;
                    toast({
                        title: "Error",
                        description: 'Something went wrong. The response from solver Server is error.'
                    })
                    setDataSolved(false);
                    return;
                }
            } catch (error) {
                paths = null;
                toast({
                    title: "Error",
                    description: 'Something went wrong.'
                })
                setDataSolved(false);
                return;
            }
        }
        if (gameState.mode === 'bot') {
            solveBoard();
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
            {gameState.mode === 'bot' && <>
                <Button disabled={!dataSolved} onClick={() => {
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
                    <AlertDialogDescription className="text-center text-md">
                        <>Time: <strong>{formatTime(gameState.currentTime)}</strong></>
                    </AlertDialogDescription>
                    <Button onClick={() => {
                        sendData();
                        handleNewBoard();
                    }}>New Board</Button>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    </section>
}