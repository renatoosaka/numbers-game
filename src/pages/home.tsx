import { Number } from "../components/numbers";
import { GameStatus, useGame } from "../context/game";

export function Home() {
  const { values, start, stop, time, status, score, clear } = useGame();

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-4 p-4 ">
      <p>
        Temos 10 bolinhas, com valor de 1 a 10 e você deve acetar os itens na
        sequência. Cada erro você deve recomeçar.
      </p>
      <p>Pressione Iniciar e divirta-se</p>
      <div className="flex flex-row gap-2 items-center">
        {status === GameStatus.stopped && (
          <button
            onClick={start}
            className="bg-green-500 p-2 rounded text-white w-20"
          >
            Iniciar
          </button>
        )}
        {status === GameStatus.running && (
          <button
            onClick={stop}
            className="bg-red-500 p-2 rounded text-white w-20"
          >
            Parar
          </button>
        )}
        <p className="font-bold text-2xl">{time}</p>
      </div>

      <div className="grid grid-cols-2">
        <div className="grid grid-cols-2 max-w-96 gap-2">
          {values.map((item) => (
            <Number value={item} key={item} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className=" flex flex-col gap-2">
            <p className="bg-gray-600 text-white text-center p-2 flex-1 rounded">
              Tempos
            </p>
            <button
              className="p-2 bg-gray-200 rounded text-gray-950 hover:bg-gray-300 transition-colors"
              onClick={clear}
            >
              Limpar
            </button>
          </div>
          <ul>
            {score.map((score) => (
              <li className="p-1">{score}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
