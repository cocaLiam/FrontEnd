// pages/Auth.jsx
import { useState } from "react";

import LoginForm from "@/components/molecules/auth_forms/LoginForm";
import SignupForm from "@/components/molecules/auth_forms/SignupForm";

const Auth = () => {
  const [isLoginForm, setAuthForm] = useState(true);

  const toggleForm = () => {
    setAuthForm(!isLoginForm);
  };

  return (
    // top-1/2 left-1/2 위에서 1/2, 왼쪽에서부터 1/2
    // transform -translate-x-1/2 -translate-y-1/2: 본인 컨테이너 사이즈의 1/2 만큼 (왼쪽,위로) 마이너스
    // --> 결과 : 정중앙
    <div className="absolute inline-block p-6 space-y-2 overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-lg shadow-lg max-h-96 top-1/3 left-1/2">
    {/* <div className="fixed z-50 inline-block p-2 mx-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-lg top-1/3 left-1/2"></div> */}
    {/* 로그인창의 위치를 잡는 상위 컨테이너 */}

      {/* <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-gray-900 rounded-lg shadow-lg w-[250px]"> */}
      <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-gray-900 rounded-lg shadow-lg w-[250px]">
      {/* 로그인창 내의 text, Form, button 들의 위치를 잡는 하위 컨테이너 */}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isLoginForm ? "로그인" : "회원가입"}
          </h2>
        </div>

        {isLoginForm ? <LoginForm /> : <SignupForm />}

        <div className="text-center">
        {/* <div className="sticky bottom-0 text-lg font-bold text-center text-gray-500 transform -translate-x-1/2 left-1/2 animate-bounce"> */}
          <button
            onClick={toggleForm}
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            {isLoginForm ? "회원가입하기" : "로그인하기"}
          </button>
        </div>
      </div>
      {isLoginForm || <div className="sticky bottom-0 text-lg font-bold text-center text-gray-100 transform -translate-x-1/2 left-1/2 animate-bounce">
        ↓
      </div>
      }
    </div>
  );
};

export default Auth;
