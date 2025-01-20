// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import DeviceCard from "@/components/molecules/DeviceCard";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

import { AuthContext } from "@/context/AuthContext";

import { andInterface } from "@/utils/android/androidInterFace";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deviceList, setDeviceList] = useState([]); // DeviceCard를 렌더링할 데이터 상태
  const [selectedDevice, setSelectedDevice] = useState(null); // 선택된 디바이스 정보를 저장하는 상태

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const auth = useContext(AuthContext);

  // Confirm 모달 띄우기 핸들러
  const handleCardClick = (deviceInfo) => {
    setSelectedDevice(deviceInfo); // 상태 업데이트
    setIsConfirmModalOpen(true);
  };

  // Confirm 모달 창 확인버튼 핸들러러
  const handleConfirmYes = async () => {
    if (!selectedDevice) return; // 선택된 디바이스가 없으면 아무 작업도 하지 않음
    const { macAddress, deviceName, battery } = selectedDevice; // 선택된 디바이스 정보 가져오기

    try {
      setIsLoading(true); // 로딩 상태 시작
      // BackEnd 에게 DB 삭제 요청
      const responseData = await sendRequest({
        url: `/api/device/${auth.dbObjectId}/deviceDelete`, // API 엔드포인트
        method: "DELETE", // HTTP 메서드
        headers: { Authorization: `Bearer ${auth.token}` }, // 현재 토큰을 Authorization 헤더에 포함
        data: { macAddress, deviceName }, // 요청 데이터
      });
      console.log("기기 삭제 성공:", responseData);
      
      // 지워진 기기 Disconnect 처리
      andInterface.reqDisconnect(macAddress, deviceName);
      // 화면 재배치
      await fetchDeviceList();
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
    setIsConfirmModalOpen(false);
  };

  // API 호출 핸들러
  const handleApiCall = async (isActive, deviceInfo) => {
    if (!deviceInfo) return; // 선택된 디바이스가 없으면 아무 작업도 하지 않음
    const { macAddress, deviceName, battery } = deviceInfo; // 선택된 디바이스 정보 가져오기

    if (isActive) {
      console.log("비활성화 API 호출");
      // 비활성화 API 호출 로직
      andInterface.pubSendData(
        macAddress,
        deviceName,
        { "toggleSwitch": "00" }
      )
    } else {
      console.log("활성화 API 호출");
      // 활성화 API 호출 로직
      andInterface.pubSendData(
        macAddress,
        deviceName,
        { "toggleSwitch": "01" }
      )
    }
  };

  // Device 리스트를 가져오는 함수
  const fetchDeviceList = async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: `/api/device/${auth.dbObjectId}/deviceList`, // 로그인 엔드포인트
        method: "GET", // HTTP 메서드
        headers: { Authorization: `Bearer ${auth.token}` }, // 현재 토큰을 Authorization 헤더에 포함
      });

      const deviceList = responseData.device_list
      // deviceList 배열인지 확인하고 상태에 저장
      if (Array.isArray(deviceList)) {
        const transformedDeviceList = deviceList.map((device) => ({
          macAddress: device.mac_address || "", // mac_address가 없으면 빈 문자열로 처리
          deviceName: device.device_name || "Unknown Device", // 기본값 설정
          deviceGroup: device.device_group || "N/A", // 기본값 설정
          battery: device.battery || "N/A", // 기본값 설정
        }));
        setDeviceList(transformedDeviceList);
      } else {
        throw new Error("Invalid response format: Expected an array");
      }
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // 컴포넌트가 처음 렌더링될 때 fetchDeviceList 실행
  useEffect(() => {
    async function fetchData() {
      await fetchDeviceList();
    }
    fetchData();
  }, []);

  useEffect(() => {
    // // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.resDisconnect = andInterface.resDisconnect;
  },[]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px", padding:"40px"}}>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <ConfirmModal
      isOpen={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      onConfirm={handleConfirmYes}
      title="작업 확인"
      content="페어링을 삭제하시겠습니까?"
      />

      {/* DeviceCard 리스트 */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {deviceList.map((deviceInfo, index) => (
          <DeviceCard
            key={deviceInfo.id || index} // 고유한 키 설정
            deviceInfo={{
              macAddress: deviceInfo.macAddress,
              deviceName: deviceInfo.deviceName,
              battery: deviceInfo.battery,
            }} // Device 이름 또는 기본 텍스트
            onCardClick={handleCardClick}
            onApiCall  ={handleApiCall}
          />
        ))}
      </div>
    </div>
  );
}

