import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Board } from "@/models/Board";
import { Path } from "@/models/Path";

const initialState = {
    board: Board.fromObject({
        board: [
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0],
            [0, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        size: { row: 12, col: 8 },
        step: new Path(2, 1),
        blockCount: 4
    }).toObject(),
    isFinished: false,
    currentTime: 0
}


export interface VisitBoardProps {
    row: number;
    col: number;
}

export interface NewBoardProps {
    board: Board;
}

export interface FinishProps {
    isFinished: boolean;
    currentTime: number;
}

const BoardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        visit: (state, action: PayloadAction<VisitBoardProps>) => {
            const board = Board.fromObject(state.board);
            board.visit(action.payload.row, action.payload.col);
            state.board = board.toObject();
        },
        replace: (state, action: PayloadAction<NewBoardProps>) => {
            state.board =  action.payload.board.toObject();
        },
        setFinish: (state, action: PayloadAction<FinishProps>) => {
            state.isFinished = action.payload.isFinished;
            state.currentTime = action.payload.currentTime;
        },
        resetFinish: (state) => {
            state.currentTime = 0;
            state.isFinished = false;
        }
    }
});

export const { visit, replace, setFinish, resetFinish } = BoardSlice.actions;

export const selectBoard = (state: RootState) => state.board;

export default BoardSlice.reducer;