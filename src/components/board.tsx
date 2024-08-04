"use client";

import { Node } from "./models/node";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { selectBoard, visit } from "@/lib/slices/board";
import { Board } from "@/models/Board";
import { getLevel, getBoardProps, getDirection } from "@/lib/utils";

export default function BoardGame() {

    const currentBoardObj = useAppSelector(selectBoard);
    const currentBoard = Board.fromObject(currentBoardObj.board);

    const dispatch = useAppDispatch();

    function handleNodeClick(row: number, col: number) {
        if (!currentBoard.isValidVisit(row, col)) {
            return;
        }
        dispatch(visit({ row, col }));
    }

    const level = getLevel(currentBoard.size);
    const matrixBoard = getBoardProps(currentBoard.size);

    currentBoard.board.map((items, row) => {
        items.map((cell, col) => {
            if (cell === 1) matrixBoard[row][col].variant = "blocked";
            else if (currentBoard.isVisited[row][col]) matrixBoard[row][col].variant = "picked";
        })
    });

    let currentStep = currentBoard.step;
    while (currentStep.before) {
        const bef = currentStep.before;
        matrixBoard[bef.row][bef.col].arrow = getDirection(bef.row, bef.col, currentStep.row, currentStep.col);
        currentStep = currentStep.before;
    }

    const board = <>
        {currentBoard.board.map((items, row) => {
            return (
                <div className="flex" key={row}>
                    {items.map((_, col) => {
                        return (
                            <Node
                                arrow={matrixBoard[row][col].arrow}
                                level={level}
                                current={currentBoard.step.isSamePoint(row, col)}
                                key={`${row}-${col}`}
                                variant={matrixBoard[row][col].variant}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNodeClick(row, col);
                                }}
                            />
                        );
                    })}
                </div>
            );
        })}
    </>

    return (
        <>
            {board}
        </>
    );

}