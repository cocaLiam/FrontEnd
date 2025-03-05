// components/LoginModal.jsx
import { useEffect, useState, useCallback, useContext } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { useHttpHook } from "@/hooks/useHttpHook";
import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

import PropTypes from "prop-types";

const GoogleLoginModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const handleCredentialResponse = useCallback(
    async (response) => {
      const credential = response.credential;
      //
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/googleLogin",
          method: "POST",
          data: { credential },
        });

        console.log("로그인 성공:", responseData);

        // 응답 데이터에서 사용자 ID와 토큰 추출
        const { dbObjectId, token } = responseData;
        await authStatus.saveToken(dbObjectId, token);

        // if (dbObjectId && token) {
        //   // 회원가입 후 자동으로 로그인 처리
        //   await authStatus.login(userEmail, password);
        // } else {
        //   console.error("회원가입 실패:", responseData);
        //   throw new Error("회원가입에 실패했습니다.");
        // }

        onClose();
      } catch (err) {
        console.error("로그인 실패:", err);
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest, onClose]
  );

  useEffect(() => {
    // window 객체에 콜백 함수 등록
    window.handleCredentialResponse = handleCredentialResponse;

    // Google OAuth 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.head.appendChild(script);

    // 클린업 함수
    return () => {
      delete window.handleCredentialResponse;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [handleCredentialResponse]); // 의존성 배열에 콜백 함수 추가
  if (!isOpen) return null;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        {/* 모달 내용 */}
        <div className="z-10 p-8 bg-white rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-black">구글 로그인</h2>

          {/* <div
            id="g_id_onload"
            data-client_id={import.meta.env.VITE_OAUTH_CLIENT_ID}
            data-callback="handleCredentialResponse"
            data-auto_prompt="true"
          /> */}
          <div
            id="g_id_onload"
            data-client_id={import.meta.env.VITE_OAUTH_CLIENT_ID}
            data-callback="handleCredentialResponse"
            data-auto_prompt="false"
            data-ux_mode="redirect" // 이 속성 추가
          />

          <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          />

          <button
            onClick={onClose}
            className="w-full px-4 py-2 mt-4 text-gray-700 transition-colors bg-gray-200 rounded hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};

GoogleLoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GoogleLoginModal;
