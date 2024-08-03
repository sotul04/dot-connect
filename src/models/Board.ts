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
        this.blockCount = 0;
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

    static fromObject(obj: {board: number[][], size: any, step: any, blockCount: number} ): Board {
        return new Board(
            obj.board,
            obj.size,
            Path.fromObject(obj.step),
            obj.blockCount
        );
    }

    static fromBoard(board: number[][]) {
        let post2: {row: number, col: number} = {row: 0, col: 0}, blockCount: number = 0;
        board.map((rows, row) => {
            rows.map((cell, col) => {
                if (cell === 2) post2 = {row, col};
                else if (cell === 1) blockCount++;
            })
        })
        return new Board(board, {row: board.length, col: board[0].length}, new Path(post2.row, post2.col), blockCount);
    }

    toObject(): any {
        return {
            board: this.board,
            isVisited: this.isVisited,
            size: this.size,
            step: this.step.toObject(),
            blockCount: this.blockCount
        };
    }

    isFinish() {
        
    }
}