// src/components/molecules/DeviceCard.jsx
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import ErrorModal from "@/components/molecules/ErrorModal";
import DeviceManagingForm from "@/components/molecules/home_forms/DeviceManagingForm";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import PowerOnIcon from "@/components/atoms/icons/PowerOnIcon";
import DeviceImgSmartToggle from "@/components/atoms/icons/DeviceImgSmartToggle";

import { handleError } from "@/utils/errorHandler";

import { andInterface } from "@/utils/android/androidInterFace";

function DevicePowerStatusIcon(deviceStatusList, targetDeviceMacAddres) {
  let powerColor = "yellow"  // 기기 Power 상태 확인 중 + 확인 불가
  const status = deviceStatusList.find(
    (tmp) => tmp.deviceInfo.macAddress === targetDeviceMacAddres
  )?.msg?.readData.status
  // console.log(`최종 PowerStatus : ${status}`)
  if(status == "1"){
    powerColor = "green"    // 기기 Power ON
  }else if (status == "0"){
    powerColor = "red"      // 기기 Power OFF
  }
  return <PowerOnIcon w="60" h="40" c={powerColor}/>
}
// Device 타입에 따라 아이콘을 선택하는 함수
function DeviceIconSelector(
  deviceType,
  deviceStatusList,
  targetDeviceMacAddres
) {
  let bluetoothConnectStatus = "white";
  // console.log(`targetDeviceMacAddres : ${targetDeviceMacAddres}`);
  // console.log(`최종 : ${JSON.stringify(deviceStatusList, null, 2)}`);
  // console.log(`최종 : ${Object.prototype.toString.call(deviceStatusList)}`);
  // console.log(`targetDeviceMacAddres ${targetDeviceMacAddres}`);

  if(deviceStatusList.length === 0){
    bluetoothConnectStatus= "yellow"  // BLE 연결중
  }

  for(let tmp of deviceStatusList){
      if(tmp.deviceInfo.macAddress === targetDeviceMacAddres){
        bluetoothConnectStatus= "green"  // BLE 연결 완료
        break;
      } else bluetoothConnectStatus= "red"  // BLE 연결 실패패
  }

  var IconComponent = "";

  switch (deviceType) {
    case "안방불11":
      IconComponent = DeviceImgSmartToggle;
      break;
    case "안방불2":
      IconComponent = DeviceImgSmartToggle;
      break;
    case "test2":
      IconComponent = DeviceImgSmartToggle;
      break;
    case "ccb_v1":
      IconComponent = DeviceImgSmartToggle;
      break;
    default:
      IconComponent = DeviceImgSmartToggle;
      break;
  }

  return (
    <IconComponent
      vx={0}
      vy={-25}
      vw={130}
      vh={130}
      c={bluetoothConnectStatus}
    />
  );
}

const DeviceCard = ({
  deviceInfo,
  deviceCardReload,
  groupCardReload,
  deviceStatusList,
}) => {
  const [isLoading, setIsLoading] = useState(false); // TODO: 나중에 기기에 readRequest 할 때 쓸 용도
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // TODO: 나중에 기기에 readRequest 할 때 쓸 용도
  const [errorMessage, setErrorMessage] = useState(""); // TODO: 나중에 기기에 readRequest 할 때 쓸 용도
  const [isDeviceManagingFormOpen, setDeviceManagingFormOpen] = useState(false);

  // Card의 상태를 관리하는 state
  const [isActive, setIsActive] = useState(false);

  // 매개변수로 전달된 device를 사용
  const { deviceGroup, macAddress, deviceName, deviceType } = deviceInfo;
  let { battery } = deviceInfo;
  

  // 우측 상단 버튼 클릭 핸들러
  const handleActionButtonClick = async () => {
    try {
      // API 호출
      await handleApiCall(isActive, deviceInfo);

      // 상태 변경
      setIsActive((prevState) => !prevState);
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  };

  // API 호출 핸들러
  const handleApiCall = async (isActive, selectedDeviceInfo) => {
    if (!selectedDeviceInfo) return; // 선택된 디바이스가 없으면 아무 작업도 하지 않음
    const { deviceGroup, macAddress, deviceName, deviceType, battery } =
      selectedDeviceInfo; // 매개변수로 전달된 device를 사용

    if (isActive) {
      console.log("비활성화 API 호출");
      // 비활성화 API 호출 로직
      andInterface.pubSendData(macAddress, deviceType, { "command": "0" });
    } else {
      console.log("활성화 API 호출");
      // 활성화 API 호출 로직
      andInterface.pubSendData(macAddress, deviceType, { "command": "1" });
    }
  };

  return (
    //
    // {/* Card 최상위 레이아웃  */}
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />

      <div
        // style={{
        //   border: "1px solid #ccc",
        //   borderRadius: "8px",
        //   padding: "8px",
        //   position: "relative",
        //   cursor: "pointer",
        //   width: "100%", // 반응형으로 동작하도록 설정
        //   maxWidth: "160px", // 최대 너비 설정
        //   display: "flex", // 버튼과 텍스트를 가로로 배치
        //   alignItems: "center", // 세로 정렬
        //   justifyContent: "space-between", // 버튼과 텍스트 간격 조정
        //   boxSizing: "border-box", // 패딩 포함 크기 계산
        // }}
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "2px",
          position: "relative",
          cursor: "pointer",
          width: "100%", // 반응형으로 동작하도록 설정
          maxWidth: "300px", // 최대 너비 설정
          display: "flex", // 버튼과 텍스트를 가로로 배치
          justifyContent: "space-between", // 버튼과 텍스트 간격 조정
          boxSizing: "border-box", // 패딩 포함 크기 계산
        }}
        onClick={() => setDeviceManagingFormOpen(true)} // 함수로 감싸기
        // onClick={setDeviceManagingFormOpen(true)} // Card 클릭 시 모달 띄우기
        className="flex flex-col"
      >
        {isDeviceManagingFormOpen && (
          <DeviceManagingForm
            setDeviceManagingFormOpen={setDeviceManagingFormOpen} // 상태 변경 함수 전달
            selectedDevice={deviceInfo}
            deviceCardReload={deviceCardReload} // deviceCard 리렌더링
            groupCardReload={groupCardReload} // groupCard 리렌더링
          />
        )}

        {/* Device Name */}
        <p className="mt-0 mb-1 ml-2 text-left text-gray-100">{deviceName}</p>

        {/* Device Icon 과 Device Name 을 Column 방식으로 Container 구성 */}
        {/* <div className="flex flex-row items-start justify-start"> */}
        {/* <div className="grid grid-cols-2 mt-0 mb-2 ml-2 mr-1"> */}
        <div className="flex items-center justify-between mt-0 mb-2 ml-2 mr-1">
          {/* Device Icon and battery*/}
          {DeviceIconSelector(deviceType, deviceStatusList, macAddress)}

          {/* ActionButton 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Card 클릭 이벤트 전파 방지
              handleActionButtonClick();
            }}
            // className="px-0 py-0 bg-gray-600 border rounded hover:bg-gray-950"
            className="items-end px-0 py-0 bg-gray-600 border rounded"
          >
            {DevicePowerStatusIcon(deviceStatusList, macAddress)}
          </button>
        </div>

        {/* Card 하단의 Gradation Styling */}
        {/* <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span> */}
        {/* 배터리 상태 표시 */}
        <span
          className={`absolute inset-x-0 bottom-0 h-1 w-full`}
          style={{
            width: `${
              battery = deviceStatusList.find(
                (tmp) => tmp.deviceInfo.macAddress === deviceInfo.macAddress
              )?.msg?.readData.battery || battery
            }%`, // 배터리 잔량에 따라 너비 설정
            backgroundColor:
              battery > 75
                ? "green"
                : battery > 50
                ? "yellow"
                : battery > 25
                ? "orange"
                : "red", // 배터리 잔량에 따라 색상 설정
            transition: "width 0.3s ease-in-out", // 애니메이션 효과
          }}
        ></span>
      </div>
    </>
  );
};

DeviceCard.propTypes = {
  deviceInfo: PropTypes.shape({
    deviceGroup: PropTypes.string.isRequired,
    macAddress: PropTypes.string.isRequired,
    deviceName: PropTypes.string.isRequired,
    deviceType: PropTypes.string.isRequired,
    battery: PropTypes.string,
  }).isRequired,
  deviceCardReload: PropTypes.func.isRequired,
  groupCardReload: PropTypes.func.isRequired,
  deviceStatusList: PropTypes.array.isRequired,
};

export default DeviceCard;
