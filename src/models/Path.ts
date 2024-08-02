export class Path {
    row: number;
    col: number;
    before: Path | null;
    length: number;

    constructor(row: number, col: number, before: Path | null = null) {
        this.row = row;
        this.col = col;
        this.before = before;
        if (before) {
            this.length = before.length + 1;
        } else {
            this.length = 1;
        }
    }

    isVisited(row: number, col: number): Path | null {
        if (row === this.row && col === this.col) {
            return this;
        }
        if (this.before) {
            return this.before.isVisited(row, col);
        }
        return null;
    }

    isValidMove(row: number, col: number): boolean {
        if (this.row === row) {
            return this.col === col + 1 || this.col === col - 1;
        }
        if (this.col === col) {
            return this.row === row + 1 || this.row === row - 1;
        }
        return false;
    }

    isSamePoint(row: number, col: number): boolean {
        return this.row === row && this.col === col;
    }

    static fromObject(obj: any): Path {
        return new Path(obj.row, obj.col, obj.before ? Path.fromObject(obj.before) : null);
    }

    toObject(): any {
        return {
            row: this.row,
            col: this.col,
            before: this.before ? this.before.toObject() : null
        };
    }
}