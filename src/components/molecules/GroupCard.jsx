// src/components/molecules/GroupCard.jsx
import { useEffect, useState, useContext, useCallback } from "react";

import PropTypes from "prop-types";

// import DeviceManagingForm from "@/components/molecules/home_forms/DeviceManagingForm";

import ErrorModal from "@/components/molecules/ErrorModal";
import DeviceCard from "@/components/molecules/DeviceCard";

import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import DebugIcon from "@/components/atoms/icons/DebugIcon";

import { AuthContext } from "@/context/AuthContext";

import {
  andInterface,
  validateDeviceInfo,
} from "@/utils/android/androidInterFace";
import { handleError } from "@/utils/errorHandler";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

const GroupCard = ({ userGroupList, groupCardReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const [isDeviceManagingFormOpen, setDeviceManagingFormOpen] = useState(false);
  // const [selectedDevice, setSelectedDevice] = useState(null); // 선택된 디바이스 정보를 저장하는 상태
  const [selectedGroup, setSelectedGroup] = useState(null); // 선택된 그룹 정보를 저장하는 상태
  const [groupObject, setGroupObject] = useState({}); // DeviceList 변경시 재적용을 위한 상태변수수
/**
 * groupObject 예시
{
  "default_group": [
    {
      "_id": "111111111111111111111111",
      "device_owner": "678df6f12129b1d1915fc4fd",
      "device_group": "default_group",
      "mac_address": "11:11:11:11:11:11",
      "device_name": "안방불11",
      "battery": "55",
      "__v": 0,
      "id": "111111111111111111111111"
    },
    {
      "_id": "111111111111111111111112",
      "device_owner": "678df6f12129b1d1915fc4fd",
      "device_group": "default_group",
      "mac_address": "11:11:11:11:11:22",
      "device_name": "test2",
      "battery": "50",
      "__v": 0,
      "id": "111111111111111111111112"
    }, ....
  ],
  "custom_group": [
  {~~}, {~~~} ...
  ]
  ...
}
*/

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
  },[userGroupList]); // 의존성 추가

  // 컴포넌트가 처음 렌더링될 때 사용자 정보 가져오기
  useEffect(() => {
    fetchDeviceList();
  },[]);

  // 기기 추가 함수 -> BackEnd 정보전달
  const createDevice = useCallback(
    async (macAddress, deviceName, battery) => {
      try {
        setIsLoading(true); // 로딩 상태 시작
        const responseData = await sendRequest({
          url: `/api/device/${authStatus.dbObjectId}/deviceCreate`, // API 엔드포인트
          method: "POST", // HTTP 메서드
          headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
          data: { deviceGroup: selectedGroup, macAddress, deviceName, battery }, // 요청 데이터
        });
        console.log("기기 생성 성공:", responseData);
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    },
    [authStatus.dbObjectId, authStatus.token, selectedGroup, sendRequest]
  );

  // 기기 추가 함수 -> Android 로 부터 Connect Response를 받는 함수
  const handleResConnect = useCallback(
    async (data) => {
      try {
        // 데이터 유효성 검사
        const validation = validateDeviceInfo(data);

        console.log("resConnect 받은 DATA:", JSON.stringify(data, null, 2));
        console.log("validation:", validation.isValid);

        if (!validation.isValid) {
          throw {
            status: 133,
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
    },
    [createDevice]
  );

  // 기기 추가 함수 -> Android 함수를 등록
  useEffect(() => {
    // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.resConnect = handleResConnect;

    return () => {
      // 페이지가 언마운트(페이지이동)될 때 등록된 함수 제거
      delete window.resConnect;
    };
  }, [handleResConnect]);
  return (
    <div className="max-w-full space-y-6 border rounded-lg shadow-md">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      {userGroupList.map((groupName) => (
        <div
          key={groupName}
          className="relative bg-transparent border border-gray-800 rounded"
        >
          {/* 왼쪽 위 "그룹명" Text */}
          <h2 className="absolute px-1 text-lg font-bold text-white -top-4 -left-0">
            {groupName}
          </h2>

          {/* 오른쪽 위 "기기추가" 버튼 */}
          <div className="absolute px-1 py-1 text-xs text-white bg-blue-500 rounded -top-4 -right-2 hover:bg-blue-600">
            <ButtonWithIcon
              icon={DebugIcon}
              content={"기기 추가"}
              onClick={() => {
                setSelectedGroup(groupName); // 선택된 그룹 지정
                andInterface.reqConnect(); // 기기 추가 함수 -> Android 요청
              }}
            />
          </div>

          {/* DeviceCard 클릭 버튼 */}
          <div className="grid grid-cols-2 gap-4 px-4 py-10">
            {(groupObject[groupName] || []).map((deviceInfo, index) => (
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
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

GroupCard.propTypes = {
  userGroupList: PropTypes.array.isRequired,
  groupCardReload: PropTypes.func.isRequired
};

export default GroupCard;
