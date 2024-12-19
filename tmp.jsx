import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css"; // Tailwind CSS가 적용된 파일

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center">
      <form className="max-w-5xl p-8 mx-auto text-center">
        <h1 className="mb-6 text-3xl font-bold">
          Hi Vite 모듈번들러, and Tailwind CSS
        </h1>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="flex flex-col">
            <p className="text-left">Tailwind CSS 확인용</p>
            <p className="text-center text-red-500">Tailwind CSS 확인용</p>
          </div>
        </div>

      </form>
    </div>
  );
}

export default App;
