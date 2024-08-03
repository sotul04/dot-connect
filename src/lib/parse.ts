export function parseBoard(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                resolve(json);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

function isNumberArrayArray(value: any): value is number[][] {
    if (!Array.isArray(value)) {
        return false;
    }
    for (const arr of value) {
        if (!Array.isArray(arr) || !arr.every(item => typeof item === 'number')) {
            return false;
        }
    }
    return true;
}

export async function getBoard(file: File): Promise<number[][] | null> {
    try {
        const data = await parseBoard(file);
        if (!data.board) return null;

        const board = data.board;
        if (!isNumberArrayArray(board)) return null;

        let count2 = 0, countOther = 0 ,previousLength = board[0].length;
        const boards: number[][] = [];

        if (board.length === 0) return null;
        
        for (let i = 0; i < board.length; i++) {
            if (previousLength !== board[i].length) return null;
            boards.push([]);
            for (let j = 0; j < previousLength; j++) {
                if (board[i][j] === 2) {
                    count2++;
                } else if (board[i][j] !== 1 && board[i][j] !== 0) {
                    countOther ++;
                }
                boards[i].push(board[i][j]);
            }
        }
        if (count2 !== 1 || countOther > 0) return null;
        
        return boards;
    } catch (error) {
        return null;
    }
    
}
