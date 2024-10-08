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

export function getSize(level: "beginner" | "easy" | "medium" | "hard" | string): {row: number, col: number} {
  if (level === "beginner") return {row: 5, col: 5}
  if (level === 'easy') return {row: 8, col: 6}
  if (level === 'medium') return {row: 10, col: 6}
  return {row: 12, col: 8}
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

// utils/formatTime.ts
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatNumber = (num: number): string => (num < 10 ? `0${num}` : num.toString());

  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(secs)}`;
};
