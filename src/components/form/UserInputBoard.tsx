'use client'

import { useState, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { replace, selectBoard } from "@/lib/slices/board";
import { getBoard } from "@/lib/parse";
import { Board } from "@/models/Board";
import { Dispatch, SetStateAction } from "react";

interface UserInputProps {
    setUploadBoard: Dispatch<SetStateAction<number[][] | null>>
}

export default function UserInputBoard( { setUploadBoard }: UserInputProps) {
    
    const boardState = useAppSelector(selectBoard);
    const dispatch = useAppDispatch();

    const [parsingMessage, setParsingMessage] = useState<string | null>(null);

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            try {
                const parsedContent = await getBoard(selectedFile);
                setUploadBoard(parsedContent);
                if (!parsedContent) setParsingMessage('The board or file format is not appropriate or there is a violation of the game rules in the file')
                else {
                    setParsingMessage(null);
                    dispatch(replace({board: parsedContent}))
                }
            } catch (error) {
                setParsingMessage('Failed to parse the file.')
            }
        }
    }

    return <div className="container my-4">
        <Label htmlFor="board-input" className="inline-flex">
            Upload your board as&nbsp;<pre><code>JSON</code></pre>&nbsp;file
        </Label>
        <Input
            className="cursor-pointer"
            id="board-input"
            type="file"
            accept="application/json"
            multiple={false}
            onChange={handleFileChange}
        />
        { parsingMessage && <p className="text-sm text-red-500 mb-4 max-w-[300px]">{parsingMessage}</p>}
        <p className="text-sm max-w-[300px]">The&nbsp;<code>JSON</code>&nbsp; file must has format like this example. The number 2 must appear once, apart from the number 2, the only other numbers accepted are 0 and 1.</p>
        <pre className="rounded-md bg-gray-300 p-4 text-gray-800 bg-opacity-90">
            <code>
                {`{
    "board": [
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 2, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
}
`}
            </code>
        </pre>
    </div>
}