import { useCallback, useEffect, useState } from "react";
import { GameSession, GameStatus, useGame } from "../context/game";

interface Props {
  value: number;
}
export function Number({ value }: Props) {
  const { session, add, status } = useGame();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (session === GameSession.waiting) {
      setFlipped(false);
    }
  }, [session]);

  const handleClick = useCallback(() => {
    if (flipped) return;
    if (status !== GameStatus.running) return;
    if (session !== GameSession.waiting) return;

    add(value);
    setFlipped(true);
  }, [add, value, session, status, flipped]);

  return (
    <button
      onClick={handleClick}
      className="text-2xl font-bold transition-colors bg-gray-300 border-2 rounded-full aspect-square hover:border-cyan-500"
    >
      {flipped && `${value}`}
    </button>
  );
}
