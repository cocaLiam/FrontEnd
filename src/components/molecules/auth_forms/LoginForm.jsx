// components/molecules/LoginForm.jsx
import { useState, useContext } from "react";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

  const auth = useContext(AuthContext);

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
      await auth.login(formData.userEmail, formData.password);
      // const res = await auth.login(formData.userEmail, formData.password);
      // console.log(`Login 성공 :`, res);
    } catch (err) {
      console.log(`Login 실패 : ${err}`);
      switch (err.status) {
        case 401:
          setErrorMessage("인증 토큰에러, 다시 로그인 해주세요 : ",err.status);
          break;
        case 403:
          setErrorMessage("비밀번호가 틀립니다. : ",err.status);
          break;
        case 404:
          setErrorMessage("Email 이 존재하지 않습니다. : ",err.status);
          break;
        case 500:
          setErrorMessage("로그인 할 수 없습니다. [ 서버 에러 : 비밀번호 검증 오류, DB query ] : ",err.status);
          break;
        default:
          setErrorMessage("로그인 실패 : ",err.status);
      }
      setIsErrorModalOpen(true);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div>
        <input
          name="userEmail"
          type="email"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="이메일"
          className="w-full p-2 text-white bg-gray-800 rounded"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호"
          className="w-full p-2 text-white bg-gray-800 rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-500 disabled:bg-blue-300"
      >
        로그인
      </button>
    </form>
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
