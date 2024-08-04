import { Path } from "./Path";

export const NEXT_MOVE = {
    block: 0,
    forward: 1,
    back: 2
}

export class Board {
    board: number[][];
    isVisited: boolean[][];
    size: { row: number, col: number };
    step: Path;
    blockCount: number;
    constructor(board: number[][], size: { row: number, col: number }, step: Path, blockCount: number = 0) {
        this.board = board.map(array => array.map(elmt => elmt));
        this.isVisited = Array.from({ length: size.row }, () => Array(size.col).fill(false));
        this.size = { ...size };
        this.step = step;
        this.blockCount = blockCount;
        if (blockCount === 0) {
            for (const rows of this.board) {
                for (const cell of rows) {
                    if (cell === 1) {
                        this.blockCount++
                    }
                }
            }
        }
        let curr: Path | null = step;
        while (curr) {
            this.isVisited[curr.row][curr.col] = true;
            curr = curr.before;
        }
    }

    isValidVisit(row: number, col: number): boolean {
        if (this.step.isValidMove(row, col)) {
            if (this.board[row][col] === 1) {
                return false;
            }
            return true;
        }
        return false;
    }

    // preq: isValidVisit(row, col)
    visit(row: number, col: number) {
        let visited = this.step.isVisited(row, col);
        if (visited) {
            let current: Path | null = this.step;
            while (current && !current.isSamePoint(row, col)) {
                this.isVisited[current.row][current.col] = false;
                current = current.before;
            }
        }
        if (!visited) {
            visited = new Path(row, col, this.step);
            this.isVisited[row][col] = true;
        }
        this.step = visited;
    }

    static fromObject(obj: { board: number[][], size: any, step: any, blockCount: number }): Board {
        return new Board(
            obj.board,
            obj.size,
            Path.fromObject(obj.step),
            obj.blockCount
        );
    }

    static fromBoard(board: number[][]) {
        let post2: { row: number, col: number } = { row: 0, col: 0 }, blockCount: number = 0;
        board.map((rows, row) => {
            rows.map((cell, col) => {
                if (cell === 2) post2 = { row, col };
                else if (cell === 1) blockCount++;
            })
        })
        return new Board(board, { row: board.length, col: board[0].length }, new Path(post2.row, post2.col), blockCount);
    }

    toObject(): {
        board: number[][],
        isVisited: boolean[][],
        size: { row: number, col: number },
        step: any,
        blockCount: number
    } {
        return {
            board: this.board,
            isVisited: this.isVisited,
            size: this.size,
            step: this.step.toObject(),
            blockCount: this.blockCount
        };
    }

    isFinish() {
        return this.size.row * this.size.col - this.blockCount <= this.step.length;
    }

    static randomBoard({ row, col }: { row: number, col: number }) {
        const board = Array.from({ length: row }, () => Array(col).fill(0));
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (chanceOfTrue(0.2)) {
                    board[i][j] = 1;
                }
            }
        }
        const srow = getRandomValue(row);
        const scol = getRandomValue(col);
        board[srow][scol] = 2;
        return board;
    }
}

function getRandomValue(x: number): number {
    return Math.floor(Math.random() * x);
}

// 0 <= probability <= 1 
function chanceOfTrue(probability: number): boolean {
    return Math.random() < probability;
}