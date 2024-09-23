import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { formatTime, shuffleArray } from "../utils";

export enum GameStatus {
  running = "running",
  stopped = "stopped",
}

export enum GameSession {
  waiting = "waiting",
  failed = "failed",
  won = "won",
}

type GameContextProps = {
  session: GameSession;
  status: GameStatus;
  values: Array<number>;
  score: Array<string>;
  time: string;
  start: () => void;
  stop: () => void;
  add: (value: number) => void;
  clear: () => void;
};

const GameContext = createContext<GameContextProps | null>(null);

const SCORE_KEY = "@osk-numbers/score";

type Props = PropsWithChildren;

export function GameProvider({ children }: Props) {
  const [status, setStatus] = useState<GameStatus>(GameStatus.stopped);
  const [seconds, setSeconds] = useState<number>(0);
  const [sequence, setSequence] = useState<Array<number>>([]);
  const [session, setSession] = useState<GameSession>(GameSession.waiting);
  const [values, setValues] = useState<Array<number>>([]);
  const [score, setScore] = useState<Array<number>>(() => {
    const score = localStorage.getItem(SCORE_KEY);

    if (!score) return [];

    return JSON.parse(score);
  });

  const gameTimer = useRef<number | null>(null);

  useEffect(() => {
    if (status !== GameStatus.running) return;

    gameTimer.current = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);

    return () => {
      if (gameTimer?.current === null) return;

      clearInterval(gameTimer.current);
    };
  }, [status, seconds]);

  useEffect(() => {
    if (sequence.length === 10 && status === GameStatus.running) {
      setSession(GameSession.won);
      setStatus(GameStatus.stopped);
      const scores = [...score, seconds];
      setScore(scores);
      localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
    }
  }, [session, sequence, score, seconds, status]);

  const time = useMemo(() => formatTime(seconds), [seconds]);

  const formattedScore = useMemo(() => {
    const _score = [...score];
    _score.sort((a, b) => a - b);

    return _score.map((score) => formatTime(score));
  }, [score]);

  const start = useCallback(() => {
    setSequence([]);
    setStatus(GameStatus.running);
    setSession(GameSession.waiting);

    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const randomArray = shuffleArray(numbers);
    setValues(randomArray);
    setSeconds(0);
  }, []);

  const stop = useCallback(() => {
    setSequence([]);
    setStatus(GameStatus.stopped);
    setSession(GameSession.waiting);
  }, []);

  const validate = useCallback(
    (value: number): boolean => {
      if (sequence.length === 0) {
        return value === 1;
      }

      const lastValue = sequence[sequence.length - 1];

      return lastValue + 1 === value;
    },
    [sequence]
  );

  const add = useCallback(
    (value: number) => {
      if (validate(value)) {
        setSequence([...sequence, value]);
      } else {
        setSession(GameSession.failed);
        setTimeout(() => {
          setSession(GameSession.waiting);
        }, 1500);
        setSequence([]);
      }
    },
    [validate, sequence]
  );

  const clear = useCallback(() => {
    localStorage.removeItem(SCORE_KEY);
    setScore([]);
  }, []);

  return (
    <GameContext.Provider
      value={{
        session,
        status,
        values,
        time,
        start,
        stop,
        add,
        clear,
        score: formattedScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("Game Provider is not setup correctly");
  }

  return context;
}
