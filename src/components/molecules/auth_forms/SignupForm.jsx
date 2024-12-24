import { useState, useContext } from "react";

import { AuthContext } from "@/context/AuthContext";
import ErrorModal from "@/components/molecules/ErrorModal";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    password: "",
    confirmPassword: "",
    homeAddress: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState({
    userName: "",
    userEmail: "",
    password: "",
    confirmPassword: "",
    homeAddress: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useContext(AuthContext);

  // 유효성 검사 함수
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "userName":
        if (!value.trim()) {
          error = "이름을 입력해주세요.";
        }
        break;

      case "userEmail": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 중괄호로 블록 스코프 생성
        if (!emailRegex.test(value)) {
          error = "유효한 이메일 주소를 입력해주세요.";
        }
        break;
      }

      case "password":
        if (value.length < 6) {
          error = "비밀번호는 최소 6자리 이상이어야 합니다.";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          error = "비밀번호가 일치하지 않습니다.";
        }
        break;

      case "homeAddress":
        if (!value.trim()) {
          error = "주소를 입력해주세요.";
        }
        break;

      case "phoneNumber": {
        const phoneRegex = /^[0-9]{10,11}$/; // 중괄호로 블록 스코프 생성
        if (!phoneRegex.test(value)) {
          error = "유효한 전화번호를 입력해주세요.";
        }
        break;
      }

      default:
        break;
    }

    return error;
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 입력값 업데이트
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 유효성 검사 실행
    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 필드 유효성 검사
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });

    // 에러가 있으면 제출 중단
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setErrorMessage("입력값을 확인해주세요.");
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await auth.signup(
        formData.userName,
        formData.userEmail,
        formData.password,
        formData.homeAddress,
        formData.phoneNumber
      );
      console.log(`Signup 성공 :`, res);
    } catch (err) {
      console.log(`Signup 실패 : ${err}`);
      console.log(err.status);
      switch (err.status) {
        case 401:
          setErrorMessage("인증 토큰에러, 다시 로그인 해주세요 : ",err.status);
          break;
        case 409:
          setErrorMessage("이미 존재하는 Email 입니다. : ",err.status);
          break;
        case 422:
          setErrorMessage("사용자 입력값 유효하지 않음\n 비밀번호 6글자 이상 : ",err.status);
          break;
        case 500:
          setErrorMessage("로그인 할 수 없습니다. [ 서버 에러 : 비밀번호 검증 오류, DB query ] : ",err.status);
          break;
        default:
          setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요. : ",err.status);
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div className="space-y-4">
        <div>
          <input
            name="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일"
          />
          {formErrors.userEmail && (
            <p className="text-sm text-red-500">{formErrors.userEmail}</p>
          )}
        </div>
        <div>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호"
          />
          {formErrors.password && (
            <p className="text-sm text-red-500">{formErrors.password}</p>
          )}
        </div>
        <div>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호 확인"
          />
          {formErrors.confirmPassword && (
            <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
          )}
        </div>
        <div>
          <input
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름"
          />
          {formErrors.userName && (
            <p className="text-sm text-red-500">{formErrors.userName}</p>
          )}
        </div>
        <div>
          <input
            name="homeAddress"
            type="text"
            value={formData.homeAddress}
            onChange={handleChange}
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="주소"
          />
          {formErrors.homeAddress && (
            <p className="text-sm text-red-500">{formErrors.homeAddress}</p>
          )}
        </div>
        <div>
          <input
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="01012341234"
          />
          {formErrors.phoneNumber && (
            <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
