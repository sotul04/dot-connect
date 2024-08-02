import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type nodeProps = {
  arrow: "default" | "left" | "top" | "right" | "bottom" | null | undefined;
  variant: "default" | "blocked" | "picked" | null | undefined;
}

export function getBoardProps({row, col}: {row: number, col: number}) {
  
  const defaultNode: nodeProps= {
    arrow: undefined,
    variant: undefined,
  }

  const matrix: nodeProps[][] = Array.from({ length: row }, () =>
    Array.from({ length: col }, () => ({ ...defaultNode }))
  );

  return matrix;
}

export function getLevel({ row, col}: {row: number, col: number}): "beginner" | "easy" | "medium" | "hard" | undefined | null {
  const dimension = row*col;
  if (dimension === 25) return "beginner";
  if (dimension === 48) return "easy";
  if (dimension === 60) return "medium";
  return "hard";
}

export function getDirection(row: number, col: number, drow: number, dcol: number) : "default" | "left" | "top" | "right" | "bottom" | null | undefined {
  if (row === drow) {
    if (col < dcol) return "right";
    if (col > dcol) return "left";
  }
  if (col === dcol) {
    if (row < drow) return "bottom";
    if (row > drow) return "top";
  }
  return "default";
}