import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="max-w-4xl p-8 text-center">
        <h1 className="mb-8 text-3xl font-bold">
          Hi Vite 모듈번들러, and Tailwind CSS
        </h1>
        
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <div className="flex flex-col">
            <p className="text-left text-red-100">Tailwind CSS 확인용3</p>
            <p className="text-center text-red-500">Tailwind CSS 확인용2</p>
          </div>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank">
            <img 
              src={viteLogo} 
              className="h-16 p-4 transition-all hover:filter hover:drop-shadow-[0_0_2em_#646cffaa]" 
              alt="Vite logo" 
            />
          </a>
          <a href="https://react.dev" target="_blank">
            <img 
              src={reactLogo} 
              className="h-16 p-4 transition-all hover:filter hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]" 
              alt="React logo" 
            />
          </a>
        </div>

        <div className="p-6 border rounded-lg shadow-md">
          <button
            type="button"
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
        </div>

        <p className="mt-6 text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </form>
    </div>
  );
}

export default App;
