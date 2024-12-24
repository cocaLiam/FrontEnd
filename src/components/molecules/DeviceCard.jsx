import { useState } from "react";
import PropTypes from "prop-types";

import SettingsIcon from "@/components/atoms/icons/SettingsIcon";

// Device 타입에 따라 아이콘을 선택하는 함수
function DeviceIconSelector(deviceType) {
  switch (deviceType) {
    case "33333333":
      return <SettingsIcon />;
    case "4444444":
      return <SettingsIcon />;
    case "222222222":
      return <SettingsIcon />;
    default:
      return <SettingsIcon />;
  }
}

const DeviceCard = ({ deviceName, deviceType, onCardClick, onApiCall }) => {
  // Card의 상태를 관리하는 state
  const [isActive, setIsActive] = useState(false);

  // 우측 상단 버튼 클릭 핸들러
  const handleActionButtonClick = async () => {
    try {
      // API 호출
      await onApiCall(isActive);

      // 상태 변경
      setIsActive((prevState) => !prevState);
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  };

  return (
    //
    // {/* Card 최상위 레이아웃  */}
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        position: "relative",
        cursor: "pointer",
        width: "100%", // 반응형으로 동작하도록 설정
        maxWidth: "150px", // 최대 너비 설정
        display: "flex", // 버튼과 텍스트를 가로로 배치
        alignItems: "center", // 세로 정렬
        justifyContent: "space-between", // 버튼과 텍스트 간격 조정
        boxSizing: "border-box", // 패딩 포함 크기 계산
      }}
      onClick={onCardClick} // Card 클릭 시 모달 띄우기
      className="flex flex-row"
    >
      {/* Card 하단의 Gradation Styling */}
      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

      {/* Device Icon 과 Device Name 을 Column 방식으로 Container 구성 */}
      <div className="flex flex-col items-start justify-start">
        {/* Device Icon */}
        {DeviceIconSelector(deviceType)}
        {/* Device Name */}
        <p className="py-1 text-gray-300">{deviceName}</p>
      </div>

      {/* ActionButton 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Card 클릭 이벤트 전파 방지
          handleActionButtonClick();
        }}
        className="px-1 py-1 font-semibold text-white border border-gray-200 rounded hover:bg-gray-800"
      >
        <SettingsIcon />
      </button>
    </div>

    // <div
    //   style={{
    //     border: "1px solid #ccc",
    //     borderRadius: "8px",
    //     padding: "8px",
    //     position: "relative",
    //     cursor: "pointer",
    //     width: "100%", // 반응형으로 동작하도록 설정
    //     maxWidth: "150px", // 최대 너비 설정
    //     display: "flex", // 버튼과 텍스트를 가로로 배치
    //     alignItems: "center", // 세로 정렬
    //     justifyContent: "space-between", // 버튼과 텍스트 간격 조정
    //     boxSizing: "border-box", // 패딩 포함 크기 계산
    //   }}
    //   onClick={onCardClick} // Card 클릭 시 모달 띄우기
    // >
    //   <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
    //   </span>

    //   {/* deviceIcon이 존재하면 렌더링 */}
    //   {DeviceIconSelector(deviceType)}
    //   <div className="my-2">
    //     <p className="py-1 text-gray-300">{deviceName}</p>
    //   </div>

    //   <div className="flex items-start justify-end">
    //     <button
    //       onClick={(e) => {
    //         e.stopPropagation(); // Card 클릭 이벤트 전파 방지
    //         handleActionButtonClick();
    //       }}
    //       className="px-1 py-1 font-semibold text-white border border-gray-200 rounded hover:bg-gray-800"
    //     >
    //       <SettingsIcon/>
    //     </button>
    //   </div>
    // </div>
  );
};

DeviceCard.propTypes = {
  deviceName: PropTypes.string,
  deviceType: PropTypes.string, // SVG 컴포넌트 타입
  onCardClick: PropTypes.func.isRequired,
  onApiCall: PropTypes.func.isRequired,
};

export default DeviceCard;
