// src/components/molecules/GroupCard.jsx
import { useEffect, useState, useContext, useCallback } from "react";

import PropTypes from "prop-types";

// import DeviceManagingForm from "@/components/molecules/home_forms/DeviceManagingForm";

import ErrorModal from "@/components/molecules/ErrorModal";
import DeviceCard from "@/components/molecules/DeviceCard";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { AuthContext } from "@/context/AuthContext";

import { handleError } from "@/utils/errorHandler";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

const GroupCard = ({ userGroupList, groupCardReload, deviceStatusList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const [isDeviceManagingFormOpen, setDeviceManagingFormOpen] = useState(false);
  // const [selectedDevice, setSelectedDevice] = useState(null); // 선택된 디바이스 정보를 저장하는 상태
  const [groupObject, setGroupObject] = useState({}); // DeviceList 변경시 재적용을 위한 상태변수

  //   /**
  //  * 디버깅용
  //  */

  //   /**
  //    * 디버깅용
  //    */

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const authStatus = useContext(AuthContext);

  // Device 리스트를 가져오는 함수
  const fetchDeviceList = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: `/api/device/${authStatus.dbObjectId}/deviceList`, // 로그인 엔드포인트
        method: "GET", // HTTP 메서드
        headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
      });

      const deviceList = responseData.deviceList;

      // groupObject 초기화
      let updatedGroupObject = {};

      for (let userGroup of userGroupList) {
        for (let deviceInfo of deviceList) {
          // 그룹이 존재하지 않으면 빈 배열로 초기화
          if (!updatedGroupObject[userGroup]) {
            updatedGroupObject[userGroup] = [];
          }

          if (userGroup === deviceInfo.device_group) {
            // 해당 Group 에 해당하는 Device 추가가
            updatedGroupObject[userGroup].push({
              deviceGroup: deviceInfo.device_group || "N/A", // 기본값 설정
              macAddress: deviceInfo.mac_address || "", // mac_address가 없으면 빈 문자열로 처리
              deviceName: deviceInfo.device_name || "Unknown Device", // 기본값 설정
              deviceType: deviceInfo.device_type || "Unknown Device", // 기본값 설정
              battery: deviceInfo.battery || "N/A", // 기본값 설정
            });
          }
        }
      }

      setGroupObject(updatedGroupObject)
      // setGroupObject((prev) => ({ ...prev, ...updatedGroupObject }));
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  },[authStatus.dbObjectId, authStatus.token, sendRequest, userGroupList]); // 의존성 추가

  // 컴포넌트가 처음 렌더링될 때 사용자 정보 가져오기
  useEffect(() => {
    fetchDeviceList();
  },[userGroupList, fetchDeviceList]);
  
  return (
    // <div className="max-w-full space-y-6 border rounded-lg shadow-md">
    <div className="max-w-full rounded-lg shadow-md">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      {userGroupList.map((groupName) => (
        <div
          key={groupName}
          // className="relative bg-transparent border border-gray-800 rounded"
          className="relative ml-2 mr-2 bg-transparent rounded"
        >
          {/* 왼쪽 위 "그룹명" Text */}
          {/* <h2 className="absolute px-1 text-lg font-bold text-white -top-4 -left-0"> */}
          <h2 className="absolute ml-2 text-lg font-bold text-white">
            {groupName}
          </h2>

          {/* DeviceCard 클릭 버튼 */}
          <div className="grid grid-cols-2 gap-2 px-1 py-7">
            {(groupObject[groupName] || []).map((deviceInfo, index) => (
              (
                <DeviceCard
                key={deviceInfo.id || index} // 고유한 키 설정
                deviceInfo={{
                  deviceGroup: deviceInfo.deviceGroup,
                  macAddress: deviceInfo.macAddress,
                  deviceName: deviceInfo.deviceName,
                  deviceType: deviceInfo.deviceType,
                  battery: deviceInfo.battery,
                }} // Device 이름 또는 기본 텍스트
                deviceCardReload={fetchDeviceList} // deviceCard 리렌더링
                groupCardReload={groupCardReload} // groupCard 리렌더링
                deviceStatusList={deviceStatusList} // 연결되어 있는 device들 List
              />
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

GroupCard.propTypes = {
  userGroupList: PropTypes.array.isRequired,
  groupCardReload: PropTypes.func.isRequired,
  deviceStatusList: PropTypes.array.isRequired,
};

export default GroupCard;
