import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
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
    currentTime: 0,
    level: 'beginner',
    mode: 'manual-random'
}


export interface VisitBoardProps {
    row: number;
    col: number;
}

export interface NewBoardProps {
    board: number[][];
}

export interface FinishProps {
    isFinished: boolean;
    currentTime: number;
}

export interface SetStepProps {
    step: number[][]
}

export interface SetLevelProps {
    level: string | 'beginner' | 'easy' | 'medium' | 'hard';
}

export interface ModeProps {
    mode: "manual-random" | "manual-custom" | "bot" | string
}

const BoardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        visit: (state, action: PayloadAction<VisitBoardProps>) => {
            const board = Board.fromObject(state.board);
            board.visit(action.payload.row, action.payload.col);
            if (board.isFinish()) {
                state.isFinished = true;
            }
            state.board = board.toObject();
        },
        replace: (state, action: PayloadAction<NewBoardProps>) => {
            state.board =  Board.fromBoard(action.payload.board).toObject();
        },
        setFinish: (state, action: PayloadAction<FinishProps>) => {
            state.isFinished = action.payload.isFinished;
            state.currentTime = action.payload.currentTime;
        },
        addStep: (state, action: PayloadAction<SetStepProps>) => {
            const paths = action.payload.step;
            let step: Path = new Path(paths[0][0], paths[0][1])
            for (let i = 1; i < paths.length; i++) {
                step = new Path(paths[i][0], paths[i][1], step);
            }
            const newBoard = new Board(state.board.board, state.board.size, step, state.board.blockCount);
            state.board = newBoard.toObject();
        },
        resetFinish: (state) => {
            state.currentTime = 0;
            state.isFinished = false;
        },
        setLevel: (state, action: PayloadAction<SetLevelProps>) => {
            state.level = action.payload.level;
        },
        setMode: (state, action: PayloadAction<ModeProps>) => {
            state.mode = action.payload.mode;
        },
        initState: () => {
            return initialState
        }
    }
});

export const { visit, replace, addStep, setFinish, resetFinish, setLevel, setMode, initState } = BoardSlice.actions;

export const selectBoard = (state: RootState) => state.board;

export default BoardSlice.reducer;