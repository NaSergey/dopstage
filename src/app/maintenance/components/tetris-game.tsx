"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import "./tetris-game.css";

interface Figure {
  name: string;
  points: [number, number][];
  mode: "rot" | "90" | "frozen" | "ball" | "explode";
  color: string;
  anchor?: [number, number];
  pointsRotated?: [number, number][][];
  disabled?: boolean;
}

interface Current {
  figure: Figure;
  rotate: number;
  color: string;
  pos: [number, number];
}

export const TetrisGame: React.FC = () => {
  const [state, setState] = useState<"running" | "pause" | "end">("running");
  const [board, setBoard] = useState<string[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [speed] = useState(5);

  const boardSizeRef = useRef({ w: 10, h: 20 });
  const previewSizeRef = useRef({ w: 4, h: 4 });
  const brickSize = 24;
  const emptyColor = "#000116";
  const boardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // State refs для game loop
  const currentRef = useRef<Current | null>(null);
  const nextFigureRef = useRef<Current | null>(null);
  const boardStateRef = useRef<string[]>([]);
  const previewStateRef = useRef<string[]>([]);
  const speedupRef = useRef(false);
  const stateRef = useRef<"running" | "pause" | "end">("running");
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const speedRef = useRef(5);
  const lastSpeedupRef = useRef(false);

  const figuresAll = useMemo<Figure[]>(
    () => [
      {
        name: "line",
        points: [[0, 0], [1, 0], [2, 0], [3, 0]],
        mode: "90",
        color: "#E7C001",
      },
      {
        name: "box",
        points: [[0, 0], [0, 1], [1, 0], [1, 1]],
        mode: "frozen",
        color: "#9061FF",
      },
      {
        name: "T",
        points: [[0, 0], [1, 0], [2, 0], [1, 1]],
        mode: "rot",
        anchor: [1, 0],
        color: "#33CA00",
      },
      {
        name: "S",
        points: [[0, 0], [1, 0], [1, 1], [2, 1]],
        mode: "90",
        color: "#508223",
      },
      {
        name: "Z",
        points: [[0, 1], [1, 1], [1, 0], [2, 0]],
        mode: "90",
        color: "#99C800",
      },
      {
        name: "L",
        points: [[0, 0], [0, 1], [0, 2], [1, 2]],
        mode: "rot",
        color: "#FF0E24",
      },
      {
        name: "J",
        points: [[1, 0], [1, 1], [1, 2], [0, 2]],
        mode: "rot",
        color: "#E7C001",
      },
    ],
    [],
  );

  const initFigures = useCallback((figList: Figure[]) => {
    figList.forEach((figure) => {
      let [x, y] = [0, 0];
      if (!figure.anchor) {
        for (const t of figure.points) {
          x = Math.max(x, t[0]);
          y = Math.max(y, t[1]);
        }
        figure.anchor = [x / 2, y / 2];
      }

      figure.pointsRotated = [];
      switch (figure.mode) {
        case "ball":
        case "explode":
        case "frozen":
          figure.pointsRotated = [
            figure.points,
            figure.points,
            figure.points,
            figure.points,
          ];
          break;
        case "rot":
          figure.pointsRotated.push(
            figure.points.map((p) => [
              Math.round(figure.anchor![0] + (p[0] - figure.anchor![0])),
              Math.round(figure.anchor![1] + (p[1] - figure.anchor![1])),
            ] as [number, number])
          );
          figure.pointsRotated.push(
            figure.points.map((p) => [
              Math.round(figure.anchor![0] - (p[1] - figure.anchor![1])),
              Math.round(figure.anchor![1] + (p[0] - figure.anchor![0])),
            ] as [number, number])
          );
          figure.pointsRotated.push(
            figure.points.map((p) => [
              Math.round(figure.anchor![0] - (p[0] - figure.anchor![0])),
              Math.round(figure.anchor![1] - (p[1] - figure.anchor![1])),
            ] as [number, number])
          );
          figure.pointsRotated.push(
            figure.points.map((p) => [
              Math.round(figure.anchor![0] + (p[1] - figure.anchor![1])),
              Math.round(figure.anchor![1] - (p[0] - figure.anchor![0])),
            ] as [number, number])
          );
          break;
        case "90":
          figure.pointsRotated.push(figure.points);
          figure.pointsRotated.push(
            figure.points.map((p) => [
              figure.anchor![1] - (p[1] - figure.anchor![1]),
              figure.anchor![0] + (p[0] - figure.anchor![0]),
            ] as [number, number])
          );
          break;
      }
    });
  }, []);

  const setFigureToMap = useCallback((
    map: string[],
    figure: Current,
    preview: boolean = false,
  ) => {
    const size = preview ? previewSizeRef.current : boardSizeRef.current;
    const [x, y] = preview
      ? [
          Math.floor(-figure.figure.anchor![0] + previewSizeRef.current.w / 2),
          Math.floor(-figure.figure.anchor![1] + previewSizeRef.current.h / 2),
        ]
      : [figure.pos[0], figure.pos[1]];

    for (const p of figure.figure.pointsRotated![figure.rotate]) {
      const px = x + p[0];
      const py = y + p[1];
      if (px >= 0 && px < size.w && py >= 0 && py < size.h) {
        map[px + py * size.w] = figure.color;
      }
    }
  }, []);

  const unsetFigureFromMap = useCallback((
    map: string[],
    figure: Current,
    preview: boolean = false,
  ) => {
    const size = preview ? previewSizeRef.current : boardSizeRef.current;
    const [x, y] = preview
      ? [
          Math.floor(-figure.figure.anchor![0] + previewSizeRef.current.w / 2),
          Math.floor(-figure.figure.anchor![1] + previewSizeRef.current.h / 2),
        ]
      : [figure.pos[0], figure.pos[1]];

    for (const p of figure.figure.pointsRotated![figure.rotate]) {
      const px = x + p[0];
      const py = y + p[1];
      if (px >= 0 && px < size.w && py >= 0 && py < size.h) {
        map[px + py * size.w] = emptyColor;
      }
    }
  }, []);

  const checkCollide = useCallback((map: string[], curr: Current): number => {
    for (const t of curr.figure.pointsRotated![curr.rotate]) {
      const x = curr.pos[0] + t[0];
      const y = curr.pos[1] + t[1];
      if (x < 0 || x >= boardSizeRef.current.w || y < 0 || y >= boardSizeRef.current.h)
        return 2;
      if (map[x + y * boardSizeRef.current.w] !== emptyColor) return 1;
    }
    return 0;
  }, []);

  const genNew = useCallback((): Current => {
    const availableFigures = figuresAll.filter((f) => !f.disabled);
    const figureData =
      availableFigures[Math.floor(Math.random() * availableFigures.length)];

    return {
      figure: figureData,
      rotate: 0,
      color:
        figureData.color || `hsl(${(Math.random() * 360) | 0}, 100%, 50%)`,
      pos: [
        Math.floor(boardSizeRef.current.w / 2 - figureData.anchor![0]),
        0,
      ],
    };
  }, [figuresAll]);

  const discardBuilded = useCallback((map: string[]) => {
    let linesCleared = 0;
    for (let y = boardSizeRef.current.h - 1; y >= 0; y--) {
      let target = y;
      while (target >= 0) {
        let n = 0;
        for (let x = 0; x < boardSizeRef.current.w; x++) {
          if (map[x + target * boardSizeRef.current.w] !== emptyColor) n++;
        }
        if (n !== boardSizeRef.current.w) break;
        target--;
        linesCleared++;
        scoreRef.current += 10;
      }
      if (target !== y) {
        const sh = y - target;
        for (let j = y; j >= sh; j--) {
          for (let x = 0; x < boardSizeRef.current.w; x++) {
            map[x + j * boardSizeRef.current.w] = map[x + (j - sh) * boardSizeRef.current.w];
          }
        }
      }
    }
    if (linesCleared > 0) {
      setScore(scoreRef.current);
    }
  }, [setScore]);

  const gameLoop = useCallback(() => {
    if (stateRef.current !== "running" || !currentRef.current) return;

    const current = currentRef.current;
    const boardState = boardStateRef.current;

    if (lastSpeedupRef.current !== speedupRef.current) {
      lastSpeedupRef.current = speedupRef.current;

      if (intervalRef.current) clearInterval(intervalRef.current);
      const delay = 50 + (1000 - 50) * (1 - (speedupRef.current ? 12 : speedRef.current) / 12);
      intervalRef.current = setInterval(gameLoop, delay);
    }

    unsetFigureFromMap(boardState, current);

    current.pos[1]++;

    if (checkCollide(boardState, current) === 0) {
      setFigureToMap(boardState, current);
    } else {
      current.pos[1]--;
      setFigureToMap(boardState, current);

      discardBuilded(boardState);

      const newCurrent = nextFigureRef.current!;
      newCurrent.pos = [
        Math.floor(boardSizeRef.current.w / 2 - newCurrent.figure.anchor![0]),
        0,
      ];

      if (checkCollide(boardState, newCurrent) === 0) {
        setFigureToMap(boardState, newCurrent);
        currentRef.current = newCurrent;

        const nextFigure = genNew();
        nextFigureRef.current = nextFigure;

        const newPreview = Array(previewSizeRef.current.w * previewSizeRef.current.h).fill(emptyColor);
        setFigureToMap(newPreview, nextFigure, true);
        previewStateRef.current = newPreview;
        setPreview([...newPreview]);
      } else {
        highScoreRef.current = Math.max(highScoreRef.current, scoreRef.current);
        stateRef.current = "end";
        setState("end");
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
    }

    setBoard([...boardState]);
  }, [checkCollide, discardBuilded, genNew, setBoard, setFigureToMap, setPreview, unsetFigureFromMap]);

  const newGame = useCallback(() => {
    initFigures(figuresAll);

    const newBoard = Array(boardSizeRef.current.w * boardSizeRef.current.h).fill(
      emptyColor
    );
    const newPreview = Array(previewSizeRef.current.w * previewSizeRef.current.h).fill(
      emptyColor
    );

    const curr = genNew();
    setFigureToMap(newBoard, curr);

    const nxt = genNew();
    setFigureToMap(newPreview, nxt, true);

    currentRef.current = curr;
    nextFigureRef.current = nxt;
    boardStateRef.current = newBoard;
    previewStateRef.current = newPreview;
    scoreRef.current = 0;
    stateRef.current = "running";
    lastSpeedupRef.current = false;
    speedupRef.current = false;

    // Перезапускаем интервал
    if (intervalRef.current) clearInterval(intervalRef.current);
    const delay = 50 + (1000 - 50) * (1 - (speedupRef.current ? 12 : speedRef.current) / 12);
    intervalRef.current = setInterval(gameLoop, delay);

    setBoard([...newBoard]);
    setPreview([...newPreview]);
    setScore(0);
    setState("running");
  }, [figuresAll, gameLoop, genNew, initFigures, setFigureToMap, setPreview, setScore]);

  const move = useCallback((x: number) => {
    if (stateRef.current !== "running" || !currentRef.current) return;

    const current = currentRef.current;
    const boardState = boardStateRef.current;

    unsetFigureFromMap(boardState, current);
    current.pos[0] += x;

    if (checkCollide(boardState, current) === 0) {
      setFigureToMap(boardState, current);
    } else {
      current.pos[0] -= x;
      setFigureToMap(boardState, current);
    }

    setBoard([...boardState]);
  }, [checkCollide, setBoard, setFigureToMap, unsetFigureFromMap]);

  const rotate = useCallback((dir: number) => {
    if (stateRef.current !== "running" || !currentRef.current) return;

    const current = currentRef.current;
    const boardState = boardStateRef.current;

    unsetFigureFromMap(boardState, current);
    const n = current.figure.pointsRotated!.length;
    current.rotate = (n + (current.rotate + dir)) % n;

    if (checkCollide(boardState, current) === 0) {
      setFigureToMap(boardState, current);
    } else {
      current.rotate = (n + (current.rotate - dir)) % n;
      setFigureToMap(boardState, current);
    }

    setBoard([...boardState]);
  }, [checkCollide, setBoard, setFigureToMap, unsetFigureFromMap]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.which) {
      case "N".charCodeAt(0):
        e.preventDefault();
        newGame();
        break;
      case "P".charCodeAt(0):
        e.preventDefault();
        setState((s) => {
          stateRef.current = s === "pause" ? "running" : "pause";
          return stateRef.current;
        });
        break;
      case 37: // left
        e.preventDefault();
        move(-1);
        break;
      case 39: // right
        e.preventDefault();
        move(1);
        break;
      case 38: // up
        e.preventDefault();
        rotate(1);
        break;
      case 40: // down
        e.preventDefault();
        if (!e.repeat && stateRef.current === "running") {
          speedupRef.current = true;
        }
        break;
    }
  }, [move, newGame, rotate]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.which === 40) {
      e.preventDefault();
      speedupRef.current = false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    boardRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Game loop
  useEffect(() => {
    stateRef.current = state;
    speedRef.current = speed;
  }, [state, speed]);

  useEffect(() => {
    const delay = 50 + (1000 - 50) * (1 - (speedupRef.current ? 12 : speedRef.current) / 12);

    intervalRef.current = setInterval(gameLoop, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameLoop]);

  // Init game
  useEffect(() => {
    newGame();
  }, [newGame]);

  return (
    <div
      className="tetris-container"
      tabIndex={0}
      ref={boardRef}
      style={{ outline: "none" }}
    >
      <div
        className="tetris-board"
        style={{ "--brick-size": `${brickSize}px` } as React.CSSProperties}
      >
        <div className="board-grid">
          {board.map((color, i) => (
            <div
              key={i}
              className="brick"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="tetris-info">
          <div className="preview-grid">
            {preview.map((color, i) => (
              <div
                key={i}
                className="brick"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="stats">
            <p className="text-base font-medium">Score: {score}</p>
            <Button className="min-w-[96px]" variant="frame" onClick={() => newGame()}>
              Start over
            </Button>
            <p className="text-base font-medium">Control with </p>
            <p className="text-base font-medium">arrows</p>
          </div>
        </div>
      </div>
    </div>
  );
};
