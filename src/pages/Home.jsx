// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";
import DeviceCard from "@/components/molecules/DeviceCard";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { AuthContext } from "@/context/AuthContext";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deviceList, setDeviceList] = useState([]); // DeviceCard를 렌더링할 데이터 상태

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const auth = useContext(AuthContext);

  // 모달 띄우기 핸들러
  const handleCardClick = () => {
    console.log("모달 창이 열렸습니다!");
  };

  // API 호출 핸들러
  const handleApiCall = async (isActive) => {
    if (isActive) {
      console.log("비활성화 API 호출");
      // 비활성화 API 호출 로직
    } else {
      console.log("활성화 API 호출");
      // 활성화 API 호출 로직
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

      console.log("DeviceList : ",responseData.device_list);
      const deviceList = responseData.device_list
      // deviceList 배열인지 확인하고 상태에 저장
      if (Array.isArray(deviceList)) {
        setDeviceList(deviceList);
      } else {
        throw new Error("Invalid response format: Expected an array");
      }
    } catch (err) {
      console.error(`Device 리스트 가져오기 실패: ${err}`);
      switch (err.status) {
        case 401:
          setErrorMessage("인증 토큰에러, 다시 로그인 해주세요 : ",err.status);
          break;
        case 204:
          setErrorMessage("사용자를 찾을 수 없습니다.");
          break;
        
        default:
          setErrorMessage(`에러 발생: ${err.message || "알 수 없는 에러"}`);
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 fetchDeviceList 실행
  useEffect(() => {
    async function fetchData() {
      await fetchDeviceList();
    }
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px", padding:"40px"}}>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />

      {/* DeviceCard 리스트 */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {deviceList.map((device, index) => (
          <DeviceCard
            key={device.id || index} // 고유한 키 설정
            deviceName={device.device_name || `Device ${index + 1}`} // Device 이름 또는 기본 텍스트
            deviceType={device.device_type} // Device 타입에 따른 아이콘
            onCardClick={handleCardClick}
            onApiCall={handleApiCall}
          />
        ))}
      </div>
    </div>
  );
}
























// import { useState } from "react";
// import PropTypes from "prop-types";

// const DeviceCard = ({ deviceName, deviceIcon, onCardClick, onApiCall }) => {
//   // Card의 상태를 관리하는 state
//   const [isActive, setIsActive] = useState(false);

//   // 우측 상단 버튼 클릭 핸들러
//   const handleActionButtonClick = async () => {
//     try {
//       // API 호출
//       await onApiCall(isActive);

//       // 상태 변경
//       setIsActive((prevState) => !prevState);
//     } catch (error) {
//       console.error("API 호출 중 오류 발생:", error);
//     }
//   };

//   return (
//     <div
//       style={{
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         padding: "8px",
//         position: "relative",
//         cursor: "pointer",
//         width: "100%", // 반응형으로 동작하도록 설정
//         maxWidth: "150px", // 최대 너비 설정
//         display: "flex", // 버튼과 텍스트를 가로로 배치
//         alignItems: "center", // 세로 정렬
//         justifyContent: "space-between", // 버튼과 텍스트 간격 조정
//         boxSizing: "border-box", // 패딩 포함 크기 계산
//       }}
//       onClick={onCardClick} // Card 클릭 시 모달 띄우기
//     >
//       <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
        
//       </span>

//       <div className="my-2">
//         {/* deviceIcon이 존재하면 렌더링 */}
//         {deviceIcon && <deviceIcon />}
//         <p className="py-1 text-gray-300">{deviceName}</p>
//       </div>

//       <div className="flex items-start justify-end">
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // Card 클릭 이벤트 전파 방지
//             handleActionButtonClick();
//           }}
//           className="px-1 py-1 font-semibold text-white border border-gray-200 rounded hover:bg-gray-800"
//         >
//           CC
//         </button>
//       </div>
//     </div>
//   );
// };

// DeviceCard.propTypes = {
//   deviceName: PropTypes.string,
//   deviceIcon: PropTypes.elementType, // SVG 컴포넌트 타입
//   onCardClick: PropTypes.func.isRequired,
//   onApiCall: PropTypes.func.isRequired,
// };

// export default DeviceCard;
