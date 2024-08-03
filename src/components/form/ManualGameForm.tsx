import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectBoard, setMode } from "@/lib/slices/board";
import { Dispatch, SetStateAction } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import UserInputBoard from "./UserInputBoard";

interface UserInputProps {
    setUploadBoard: Dispatch<SetStateAction<number[][] | null>>
}

export default function ManualForm({ setUploadBoard }: UserInputProps) {

    const dispatch = useAppDispatch();
    const gameState = useAppSelector(selectBoard);

    return <>
        <div className="container my-4">
            <Label>Select Mode</Label>
            <Select onValueChange={(value) => dispatch(setMode({ mode: value }))}>
                <SelectTrigger className="w-[220px] ">
                    <SelectValue placeholder="Random" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="manual-random" >Random</SelectItem>
                        <SelectItem value="manual-custom" >Custom</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        {gameState.mode === 'manual-custom' && <UserInputBoard setUploadBoard={setUploadBoard}/>}
    </>
}