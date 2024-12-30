import { useState } from "react";
import PropTypes from "prop-types";

import SettingsIcon from "@/components/atoms/icons/SettingsIcon";
import DebugIcon from "@/components/atoms/icons/DebugIcon";

// Device 타입에 따라 아이콘을 선택하는 함수
function DeviceIconSelector(deviceName) {
  switch (deviceName) {
    case "안방불1":
      return <DebugIcon />;
    case "안방불2":
      return <DebugIcon />;
    case "222222222":
      return <DebugIcon />;
    default:
      return <SettingsIcon />;
  }
}

const DeviceCard = ({ deviceInfo, onCardClick, onApiCall }) => {
  // console.log("deviceInfo : ", JSON.stringify(deviceInfo,null,2));
  const { macAddress, deviceName, battery } = deviceInfo; // 매개변수로 전달된 device를 사용

  // Card의 상태를 관리하는 state
  const [isActive, setIsActive] = useState(false);

  // 우측 상단 버튼 클릭 핸들러
  const handleActionButtonClick = async () => {
    try {
      // API 호출
      await onApiCall(isActive, deviceInfo);

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
        maxWidth: "160px", // 최대 너비 설정
        display: "flex", // 버튼과 텍스트를 가로로 배치
        alignItems: "center", // 세로 정렬
        justifyContent: "space-between", // 버튼과 텍스트 간격 조정
        boxSizing: "border-box", // 패딩 포함 크기 계산
      }}
      onClick={() => onCardClick(deviceInfo)} // Card 클릭 시 모달 띄우기
      className="flex flex-row"
    >
      {/* Card 하단의 Gradation Styling */}
      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

      {/* Device Icon 과 Device Name 을 Column 방식으로 Container 구성 */}
      <div className="flex flex-col items-start justify-start">
        {/* Device Icon */}
        {DeviceIconSelector(deviceName)}
        {/* Device Name */}
        <p className="py-1 text-gray-100">{deviceName}</p>
      </div>

      {/* ActionButton 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Card 클릭 이벤트 전파 방지
          handleActionButtonClick();
        }}
        className="px-1 py-1 font-semibold text-gray-100 border border-gray-900 rounded hover:bg-gray-800"
      >
        <SettingsIcon />
      </button>
    </div>
  );
};

DeviceCard.propTypes = {
  deviceInfo: PropTypes.shape({
    macAddress: PropTypes.string.isRequired,
    deviceName: PropTypes.string.isRequired,
    battery: PropTypes.string,
  }).isRequired,
  onCardClick: PropTypes.func.isRequired,
  onApiCall: PropTypes.func.isRequired,
};

export default DeviceCard;
