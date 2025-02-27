// @/components/molecules/auth_forms/LoginForm.jsx
import { useState, useContext, useCallback } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import InputModal from "@/components/molecules/InputModal";
import GoogleLoginModal from "@/components/molecules/GoogleLoginModal";
import { useHttpHook } from "@/hooks/useHttpHook";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";

import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const authStatus = useContext(AuthContext);

  const [isInputModalOpen, setInputModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Google Modal

  const { sendRequest } = useHttpHook();

  const passwordReset = useCallback(
    async (userEmail) => {
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/passwordReset",
          method: "POST",
          data: { userEmail },
        });
        console.log(`responseData : ${JSON.stringify(responseData, null, 2)}`);
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authStatus.login(formData.userEmail, formData.password);
      // const res = await authStatus.login(formData.userEmail, formData.password);
      // console.log(`Login 성공 :`, res);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const handleInputConfirm = (inputValue) => {
    console.log("Input 입력값 : ", inputValue);
    passwordReset(inputValue);
    setInputModalOpen(false);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <InputModal
        isOpen={isInputModalOpen}
        onConfirm={handleInputConfirm}
        setClose={() => setInputModalOpen(false)}
        title="비밀번호 찾기"
        content="가입하신 이메일 주소를 입력해 주세요. 임시 비밀번호를 이메일로 발송해 드립니다."
        inputTextType="userEmail"
        placeHolder="help@cocabot.com"
        setPasswordCheck={false}
      />
      <GoogleLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <form onSubmit={handleSubmit} className="w-full space-y-2">
        <div>
          <input
            className="w-full p-2 text-white bg-gray-800 rounded"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="이메일"
            required
          />
        </div>
        <div>
          <input
            className="w-full p-2 text-white bg-gray-800 rounded"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-1 text-white bg-blue-600 rounded hover:bg-blue-500 disabled:bg-blue-300"
        >
          로그인
        </button>
        {/* <div className="grid grid-cols-3"> */}
        <div className="flex justify-between">
          <ButtonWithIcon
            content="Google"
            classStyle="justify-center"
            onClick={() => {console.log("Google"); setIsModalOpen(true);}}
          />
          <ButtonWithIcon
            content="Naver"
            classStyle="justify-center"
            onClick={() => console.log("Naver")}
          />
          <ButtonWithIcon
            content="kakao"
            classStyle="justify-center"
            onClick={() => console.log("kakao")}
          />
        </div>
        <div className="text-xs">
          <span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => console.log("Email clicked")}
            >
              Email
            </span>{" "}
            찾기
            {/* 줄바꿈 */}
            <br />
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                console.log("Password clicked");
                setInputModalOpen(true);
              }}
            >
              Password
            </span>{" "}
            초기화
          </span>
        </div>
      </form>
    </>
    // <form onSubmit={handleSubmit} className="mt-8 space-y-6">
    //   <div className="space-y-4">
    //     <div>
    //       <label htmlFor="email" className="sr-only">이메일</label>
    //       <input
    //         id="email"
    //         name="email"
    //         type="email"
    //         required
    //         className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         placeholder="이메일"
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password" className="sr-only">비밀번호</label>
    //       <input
    //         id="password"
    //         name="password"
    //         type="password"
    //         required
    //         className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         placeholder="비밀번호"
    //       />
    //     </div>
    //   </div>
    //   <button
    //     type="submit"
    //     className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    //   >
    //     로그인
    //   </button>
    // </form>
  );
};

export default LoginForm;
