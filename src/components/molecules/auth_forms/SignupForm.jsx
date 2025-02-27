// @/components/molecules/auth_forms/SignupForm
import { useState, useContext, useEffect, useCallback, useRef } from "react";

import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import
import { useHttpHook } from "@/hooks/useHttpHook";

import ErrorModal from "@/components/molecules/ErrorModal";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";

import { AuthContext } from "@/context/AuthContext";

const VALIDATION_CODE_EXPRIRE_TIME = 30;
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

  const [sendButtonContent, setSendButtonContent] = useState("전송"); // Email 요청 버튼 상태
  const [emailTimer, setEmailTimer] = useState(null);  // 전송 후 제한시간
  const [verificationInput, setVerificationInput] = useState(false);  // pinCode 입력칸 disable
  const [verificationCode, setVerificationCode] = useState(["","","",""]);  // pinCode UI 저장
  const inputRefs = useRef([]); // pinCode Data 저장

  const authStatus = useContext(AuthContext);
  const { sendRequest } = useHttpHook();

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
      const res = await authStatus.signup(
        formData.userName,
        formData.userEmail,
        formData.password,
        formData.homeAddress,
        formData.phoneNumber
      );
      console.log(`Signup 성공 :`, res);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const startEmailTimer = useCallback((seconds) => {
    // 기존 타이머가 있다면 제거
    if (emailTimer) {clearInterval(emailTimer); setVerificationInput(false);}

    const timer = setInterval(() => {
      seconds--;

      // 시간 형식 변환 (분:초)
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const timeString = `${minutes}분 ${remainingSeconds
        .toString()
        .padStart(2, "0")}초`;

      if (seconds <= 0) {
        clearInterval(timer);
        setVerificationInput(false);
        setSendButtonContent("재전송");
      } else {
        setSendButtonContent(timeString);
      }
    }, 1000);

    setEmailTimer(timer);
  },[emailTimer]);

  const verifyEmail = useCallback(async (userEmail) => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: "/api/oauth/verifyEmail",
        method: "POST",
        data: {userEmail}
      });
      console.log(`responseData : ${JSON.stringify(responseData,null,2)}`);
      startEmailTimer(VALIDATION_CODE_EXPRIRE_TIME);
      setVerificationInput(true)
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen);
    } finally {
      setIsLoading(false);
    }
  }, [sendRequest,startEmailTimer]);

  const checkEmail = useCallback(async (userEmail,pinCode) => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: "/api/oauth/checkEmail",
        method: "POST",
        data: {userEmail, pinCode}
      });
      console.log(`responseData : ${JSON.stringify(responseData,null,2)}`);
      console.log(responseData);
      clearInterval(emailTimer)
      setVerificationInput(false);
      setSendButtonContent("인증 성공")
      // startEmailTimer(0)
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen);
    } finally {
      setIsLoading(false);
    }
  }, [emailTimer, sendRequest]);
  
  const handleCodeChange = useCallback((index, value) => {
    if (value.length > 1) return;
  
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  
    if (value && index < verificationCode.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }, [verificationCode]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }, [verificationCode]);

  // 컴포넌트가 언마운트될 때 타이머 정리
  useEffect(() => {
    return () => {
      if (emailTimer) clearInterval(emailTimer);
    };
  }, [emailTimer]);

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-row items-center space-x-2">
            <input
              name="userEmail"
              type="email"
              value={formData.userEmail}
              onChange={handleChange}
              required
              className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일"
              disabled={sendButtonContent !== "전송" && sendButtonContent !== "재전송"} // 타이머 동작 중에는 입력창 비활성화
            />
            {formData.userEmail !== "" && formErrors.userEmail === "" && (
              // Email요청 전송 버튼
              <ButtonWithIcon
                content={sendButtonContent}
                onClick={() => {
                  if (
                    sendButtonContent === "전송" ||
                    sendButtonContent === "재전송"
                  ) {
                    verifyEmail(formData.userEmail)
                  }
                }}
              />
            )}
          </div>
          {formErrors.userEmail && (
            <p className="text-sm text-red-500">{formErrors.userEmail}</p>
          )}
          {verificationInput && <div className="flex justify-center space-x-2">
            {/* PinCode 검사 */}
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="w-10 h-10 text-xs font-bold text-center text-white bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
            <ButtonWithIcon content="전송" onClick={() => checkEmail(formData.userEmail,verificationCode.join(''))}/>
          </div>}
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
        // className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        className={`w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${sendButtonContent === "인증 성공" 
            ? "bg-blue-600 hover:bg-blue-700" 
            : "bg-gray-500 cursor-not-allowed"}`}
        disabled={!(sendButtonContent === "인증 성공")}
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
