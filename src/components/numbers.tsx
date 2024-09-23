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
    if (status !== GameStatus.running) return;
    if (session !== GameSession.waiting) return;

    add(value);
    setFlipped(true);
  }, [add, value, session, status]);

  return (
    <button
      onClick={handleClick}
      className="aspect-square bg-gray-300 rounded-full border-2 hover:border-cyan-500 transition-colors font-bold text-2xl"
    >
      {flipped && `${value}`}
    </button>
  );
}
