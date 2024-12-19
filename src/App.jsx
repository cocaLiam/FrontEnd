import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <form>
      <h1>Hi Vite 모듈번들러, and tailWind CSS</h1>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div className="flex flex-col">
          <p1 className="text-left ">taiWind CSS 확인용</p1>
          <p1 className="text-left text-red-500">taiWind CSS 확인용</p1>
        </div>
      </div>
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <div className="card">
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    </form>
  );
}

export default App;
