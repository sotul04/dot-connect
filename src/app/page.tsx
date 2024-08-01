"use client";

import { Node, VariantNode } from "@/components/models/node";
import { useState } from "react";

export default function Home() {
  const [boardState, setBoardState] = useState([
    [1, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
    [0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);

  function handleNodeClick(row: number, col: number) {
    if (boardState[row][col] === 1) {
      return;
    }
    setBoardState((prevState) => {
      const newState = prevState.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((cell, colIndex) =>
              colIndex === col ? (cell === 0 ? 2 : 0) : cell
            )
          : r
      );
      return newState;
    });
  }

  const board = (
    <>
      {boardState.map((items, row) => {
        return (
          <div className="flex" key={row}>
            {items.map((item, col) => {
              let variantNode: VariantNode = { variant: "default" };
              if (item === 1) {
                variantNode.variant = "blocked";
              } else if (item === 2) {
                variantNode.variant = "picked";
              }
              return (
                <Node
                  level="easy"
                  current={variantNode.variant === "picked"}
                  key={`${row}-${col}`}
                  variant={variantNode.variant}
                  onClick={() => {
                    handleNodeClick(row, col);
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );

  return (
    <section className="w-full flex flex-col justify-center items-center">
      {board}
      <div className="w-[80px] h-[80px] bg-green-700 rounded-full animate-pulse"></div>
    </section>
  );
}
