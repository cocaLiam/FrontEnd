// src/components/molecules/GroupCard.jsx
import { useEffect, useState, useContext, useCallback } from "react";

import PropTypes from "prop-types";

import ErrorModal from "@/components/molecules/ErrorModal";
import ConfirmModal from "@/components/molecules/ConfirmModal";
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

const GroupCard = ({ userGroupList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); // 선택된 디바이스 정보를 저장하는 상태
  const [selectedGroup, setSelectedGroup] = useState(null); // 선택된 그룹룹 정보를 저장하는 상태
  const [groupObject, setGroupObject] = useState(Object);

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const auth = useContext(AuthContext);

  /**
   * 디버깅용
   */
  useEffect(() => {
    console.log("선택된 디바이스 :", selectedDevice);
  }, [selectedDevice]);

  useEffect(() => {
    console.log("선택된 그룹", selectedGroup);
  }, [selectedGroup]);
  /**
   * 디버깅용
   */

  // Device 리스트를 가져오는 함수
  const fetchDeviceList = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: `/api/device/${auth.dbObjectId}/deviceList`, // 로그인 엔드포인트
        method: "GET", // HTTP 메서드
        headers: { Authorization: `Bearer ${auth.token}` }, // 현재 토큰을 Authorization 헤더에 포함
      });

      const deviceList = responseData.device_list;

      // groupObject 초기화
      let tmp = {};

      for (let userGroup of userGroupList) {
        for (let deviceInfo of deviceList) {
          // 그룹이 존재하지 않으면 빈 배열로 초기화
          if (!tmp[userGroup]) {
            tmp[userGroup] = [];
          }

          if (userGroup === deviceInfo.device_group) {
            // 해당 Group 에 해당하는 Device 추가가
            tmp[userGroup].push({
              macAddress: deviceInfo.mac_address || "", // mac_address가 없으면 빈 문자열로 처리
              deviceName: deviceInfo.device_name || "Unknown Device", // 기본값 설정
              deviceGroup: deviceInfo.device_group || "N/A", // 기본값 설정
              battery: deviceInfo.battery || "N/A", // 기본값 설정
            });
          }
        }
      }

      // // tmp 객체를 콘솔에 출력
      // console.log("Home 화면 출력 Data : ");
      // console.log(JSON.stringify(tmp, null, 2)); // 객체를 계층적으로 출력

      // groupObject 에 대입
      setGroupObject(tmp);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, [userGroupList, sendRequest, auth.dbObjectId, auth.token]); // 의존성 추가

  // 처음 렌더링될 때 Device 리스트를 가져오는 함수 ( 새로고침시 )
  useEffect(() => {
    // userGroupList 데이터를 받아온 시점에 동작
    if (userGroupList && userGroupList.length > 0) {
      fetchDeviceList();
    }
  }, [userGroupList, fetchDeviceList]);

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
      // // 화면 재배치
      await fetchDeviceList();
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
    setIsConfirmModalOpen(false);
  };

  // Confirm 모달 띄우기 핸들러
  const handleCardClick = (deviceInfo) => {
    setSelectedDevice(deviceInfo); // 상태 업데이트
    setIsConfirmModalOpen(true);
  };

  // 기기 추가 함수 -> BackEnd 정보전달
  const createDevice = useCallback(async (macAddress, deviceName, battery) => {
    try {
      setIsLoading(true); // 로딩 상태 시작
      const responseData = await sendRequest({
        url: `/api/device/${auth.dbObjectId}/deviceCreate`, // API 엔드포인트
        method: "POST", // HTTP 메서드
        headers: { Authorization: `Bearer ${auth.token}` }, // 현재 토큰을 Authorization 헤더에 포함
        data: { deviceGroup: selectedGroup, macAddress, deviceName, battery }, // 요청 데이터
      });
      console.log("기기 생성 성공:", responseData);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  },[auth.dbObjectId, auth.token, selectedGroup, sendRequest]);

  // 기기 추가 함수 -> Android 로 부터 Connect Response를 받는 함수
  const handleResConnect = useCallback(async (data) => {
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
  },[createDevice]);

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
    // <div className="w-64 border rounded-lg shadow-md">
    // 전체 컨테이너너
    <div className="max-w-full space-y-6 border rounded-lg shadow-md">
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
      {Object.entries(groupObject).map(([groupName, deviceList]) => (
        <div
          key={groupName}
          className="relative bg-transparent border border-gray-800 rounded"
        >
          {/* 왼쪽 위 Name */}
          <h2 className="absolute px-1 text-lg font-bold text-white -top-4 -left-0">
            {groupName}
          </h2>

          {/* 오른쪽 위 버튼 */}
          {/* <div className="absolute px-3 py-1 text-xs text-white bg-blue-500 rounded -top-4 -right-2 hover:bg-blue-600"> */}
          <div className="absolute px-1 py-1 text-xs text-white bg-blue-500 rounded -top-4 -right-2 hover:bg-blue-600">
            <ButtonWithIcon
              icon={DebugIcon}
              content={"기기 추가"}
              onClick={() => {
                setSelectedGroup(groupName)  // 선택된 그룹 지정
                andInterface.reqConnect();   // 기기 추가 함수 -> Android 요청청
              }}
            />
          </div>

          {/* Device 리스트 */}
          {/* <div className="flex flex-row flex-wrap max-w-xl gap-4 px-4 py-10"> */}
          <div className="grid grid-cols-2 gap-4 px-4 py-10">
            {/* <div className="flex flex-row flex-wrap justify-start max-w-xl gap-4 px-4 py-10"> */}
            {/* <ButtonWithIcon icon={DebugIcon} content={"11"} onClick={console.log()}/>
            <ButtonWithIcon icon={DebugIcon} content={"22"} onClick={console.log()}/>
            <ButtonWithIcon icon={DebugIcon} content={"33"} onClick={console.log()}/>
            <ButtonWithIcon icon={DebugIcon} content={"44"} onClick={console.log()}/>
            <ButtonWithIcon icon={DebugIcon} content={"55"} onClick={console.log()}/>
            <ButtonWithIcon icon={DebugIcon} content={"66"} onClick={console.log()}/>
            <ButtonWithIcon icon={DebugIcon} content={"77"} onClick={console.log()}/> */}
            {deviceList.map((deviceInfo, index) => (
              <DeviceCard
                key={deviceInfo.id || index} // 고유한 키 설정
                deviceInfo={{
                  macAddress: deviceInfo.macAddress,
                  deviceName: deviceInfo.deviceName,
                  battery: deviceInfo.battery,
                }} // Device 이름 또는 기본 텍스트
                onCardClick={handleCardClick}
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
};

export default GroupCard;
