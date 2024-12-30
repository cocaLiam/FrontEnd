// src/pages/AddDevice.jsx
import { useEffect, useState, useContext } from "react";

import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import DebugIcon from "@/components/atoms/icons/DebugIcon";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ErrorModal from "@/components/molecules/ErrorModal";

import { handleError } from "@/utils/errorHandler";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { AuthContext } from "@/context/AuthContext";

import { andInterface, validateDeviceInfo } from "@/utils/android/androidInterFace";

export default function AddDevice() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpHook();

  // 기기 생성 함수
  const createDevice = async (macAddress, deviceName, battery) => {
    try {
      setIsLoading(true); // 로딩 상태 시작
      const responseData = await sendRequest({
        url: `/api/device/${auth.dbObjectId}/deviceCreate`, // API 엔드포인트
        method: "POST", // HTTP 메서드
        headers: { Authorization: `Bearer ${auth.token}` }, // 현재 토큰을 Authorization 헤더에 포함
        data: { macAddress, deviceName, battery }, // 요청 데이터
      });
      console.log("기기 생성 성공:", responseData);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };
  
  // Android에서 호출하는 함수
  const handleResConnect = async (data) => {
    try {
      // 데이터 유효성 검사
      const validation = validateDeviceInfo(data);

      console.log("resConnect 받은 DATA:", JSON.stringify(data,null, 2));
      console.log("validation:", validation.isValid);
      
      if (!validation.isValid) {
        throw {
          status: 133
        };
      }

      // 데이터가 유효하면 기기 생성
      console.log("유효한 데이터:", data);
      await createDevice(data.macAddress, data.deviceName, "50");

      return true; // Android로 반환
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };


  useEffect(() => {
    // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.resConnect = handleResConnect;

    return () => {
      // 페이지가 언마운트될 때 등록된 함수 제거
      console.log("기존의 window.resConnect가 초기화됩니다.");
      delete window.resConnect;
    };
  }, []);

  return (
    <div className="flex flex-col">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div>Device 추가 메뉴얼 : 화면에 보이는 IoT 기기를 체크 한 후, Connect 버튼을 눌러주세요</div>
      <ButtonWithIcon
        icon={DebugIcon}
        content="IoT 기기 추가하기"
        onClick={() => {
          andInterface.reqConnect();
        }}
      />
    </div>
  );
}
