// @/components/molecules/home_forms/DeviceManagingForm
import React, { useCallback, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import ErrorModal from "@/components/molecules/ErrorModal";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import RadioModal from "@/components/molecules/RadioModal";
import InputModal from "@/components/molecules/InputModal";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import CloseButton from "@/components/atoms/CloseButton";

import { handleError } from "@/utils/errorHandler";

import { AuthContext } from "@/context/AuthContext";
import { useHttpHook } from "@/hooks/useHttpHook";

import { andInterface } from "@/utils/android/androidInterFace";

const DeviceManagingForm = ({
  setDeviceManagingFormOpen,
  selectedDevice,
  deviceCardReload,
  groupCardReload,
}) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInputModalOpen, setInputModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfo, setUserInfo] = useState({});

  const [isRadioModalOpen, setRadioModalOpen] = useState(false);
  const [selectedRadioButton, setSelectedContent] = useState("");

  const authStatus = useContext(AuthContext);
  const { sendRequest } = useHttpHook();

  // const onClose = () => {
  //   console.log("onClose called");
  //   setDeviceManagingFormOpen(false);
  //   console.log("After setDeviceManagingFormOpen");
  // };

  // const onClose = () => {setDeviceManagingFormOpen(false); console.log("11"); console.log(setDeviceManagingFormOpen)}

  const fetchUserInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: "/api/user/getUserInfo",
        method: "GET",
        headers: { Authorization: `Bearer ${authStatus.token}` },
      });
      setUserInfo(responseData.userInfo);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen);
    } finally {
      setIsLoading(false);
    }
  }, [authStatus.token, sendRequest]);

  const handleGroupAction = useCallback(
    async (actionType, inputValue) => {
      if (!selectedDevice) return; // 선택된 디바이스가 없으면 아무 작업도 하지 않음
      const { deviceGroup, macAddress, deviceName, deviceType, battery } =
        selectedDevice; // 선택된 디바이스 정보 가져오기

      console.log(` actionType  :: ${actionType}`);
      console.log(` inputValue  :: ${inputValue}`);
      setIsLoading(true);
      try {
        let url, data, method;
        switch (actionType) {
          case "deviceGroupUpdate": {
            // Device Group 수정 함수
            url = `/api/device/${authStatus.dbObjectId}/deviceGroupUpdate`;
            data = {
              macAddress: macAddress,
              deviceGroup: inputValue,
            };
            method = "PATCH";

            // // groupCard 리렌더링
            // await groupCardReload();
            // console.log("그룹카드 리로딩@@@")
            break;
          }
          case "deviceUpdate": {
            // Device Group 수정 함수
            url = `/api/device/${authStatus.dbObjectId}/deviceUpdate`;
            data = {
              macAddress: macAddress,
              deviceName: inputValue,
            };
            method = "PATCH";

            // // groupCard 리렌더링
            // await groupCardReload();
            // console.log("그룹카드 리로딩@@@")
            break;
          }
          case "deviceDelete": {
            // Device Group 삭제 함수
            url = `/api/device/${authStatus.dbObjectId}/deviceDelete`;
            data = {
              macAddress: macAddress,
              deviceType: deviceType,
            };
            method = "DELETE";

            // 지워진 기기 Disconnect 처리
            andInterface.reqDisconnect(macAddress, deviceType);
            andInterface.reqRemoveParing(macAddress, deviceType)

            // // 화면 재배치
            // await fetchDeviceList();
            break;
          }
          default:
            throw new Error(`Unexpected ActionType: ${actionType}`);
        }

        const responseData = await sendRequest({
          url: url,
          method: method,
          data: data,
          headers: { Authorization: `Bearer ${authStatus.token}` },
        });

        // 화면 종료
        setDeviceManagingFormOpen(false);

        // // deviceCard 리렌더링
        // await deviceCardReload();
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);

        // deviceCard 리렌더링
        await deviceCardReload();

        // // groupCard 리렌더링
        // await groupCardReload();
      }
    },
    [authStatus, sendRequest]
  );

  // 컴포넌트가 처음 렌더링될 때 사용자 정보 가져오기
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // // 컴포넌트가 처음 렌더링될 때 사용자 정보 가져오기
  // useEffect(() => {
  //   const waitFectchData = async () => {
  //     await fetchUserInfo();
  //   };
  //   waitFectchData();
  // }, [fetchUserInfo]);

  return (
    <>
      {/* 모달 컨테이너 배경화면 (오버레이) */}
      <div
        className="fixed inset-0 z-10 w-full h-full bg-black bg-opacity-30"
        onClick={(e) => {
          setDeviceManagingFormOpen(false);
          e.stopPropagation();
        }}
      />

      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          handleGroupAction("deviceDelete", "");
          setIsConfirmModalOpen(false);
        }}
        title="작업 확인"
        content="정말 이 작업을 진행하시겠습니까?"
      />
      {userInfo.deviceGroupList && (
        <RadioModal
          isOpen={isRadioModalOpen}
          onClose={() => setRadioModalOpen(false)}
          onConfirm={() =>
            handleGroupAction("deviceGroupUpdate", selectedRadioButton)
          }
          title={"Group 변경"}
          contents={userInfo.deviceGroupList}
          // contents={["aa","bb","cc"]}
          setSelectedContent={(target) => setSelectedContent(target)}
        />
      )}
      <InputModal
        isOpen={isInputModalOpen}
        onConfirm={(inputValue) =>
          handleGroupAction("deviceUpdate", inputValue)
        }
        setClose={() => setInputModalOpen(false)}
        title="이름 변경"
        content={`현재 기기 명 : ${selectedDevice.deviceName}`}
        inputTextType="updateDeviceInfo"
        placeHolder="변경할 기기 명"
        hintList={[]}
        setPasswordCheck={false}
      />

      {/* 모달 컨테이너 // overflow-y-auto 위아래 스크롤(Scroll)*/}
      <div
        className="fixed z-40 inline-block w-10/12 max-w-lg p-2 mx-auto overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl max-h-96 top-1/3 left-1/2 "
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClose={() => setDeviceManagingFormOpen(false)} />

        <div className="flex flex-col py-1">
          <h2 className="px-2 mb-4 text-lg font-bold text-center text-black">
            - 기기 관리 -
          </h2>

          {/* <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800"> */}
          <div className="flex items-center p-1 mb-4 bg-white border border-gray-800">
            <span className="flex-wrap text-sm text-black">
              {selectedDevice.deviceGroup}
            </span>
            <div className="ml-auto">
              <button
                className="text-black bg-orange-300 hover:bg-orange-400"
                onClick={() => setRadioModalOpen(true)}
              >
                해당 기기 Group 변경
              </button>
            </div>
          </div>

          <div className="flex items-center p-1 mb-2 bg-white border border-gray-800">
            <span className="flex-wrap text-sm text-black">
              {selectedDevice.deviceName}
            </span>
            <div className="ml-auto">
              <button
                className="text-black bg-orange-300 text- hover:bg-orange-400"
                onClick={() => {
                  setInputModalOpen(true);
                }}
              >
                이름 변경
              </button>
              <button
                className="text-black bg-orange-300 hover:bg-orange-400"
                onClick={() => {
                  setIsConfirmModalOpen(true);
                }}
              >
                삭제
              </button>
            </div>
          </div>
          <div className="flex items-center p-1 mb-1 bg-white border border-gray-800">
            <span className="flex-wrap text-sm text-black">
              {`battery : ${selectedDevice.battery}`}
            </span>
          </div>
        </div>
        <div className="flex items-center p-1 mb-2 bg-white border border-gray-800">
          <span className="flex-wrap text-sm text-black">
            {`deviceType : ${selectedDevice.deviceType}`}
          </span>
        </div>
        <div className="flex items-center p-1 mb-2 bg-white border border-gray-800">
          <span className="flex-wrap text-sm text-black">
            {`macAddress : ${selectedDevice.macAddress}`}
          </span>
        </div>
        <div className="sticky bottom-0 text-lg font-bold text-center text-gray-500 transform -translate-x-1/2 left-1/2 animate-bounce">
          ↓
        </div>
      </div>
    </>
  );
};

DeviceManagingForm.propTypes = {
  setDeviceManagingFormOpen: PropTypes.func.isRequired,
  selectedDevice: PropTypes.shape({
    deviceGroup: PropTypes.string.isRequired,
    macAddress: PropTypes.string.isRequired,
    deviceName: PropTypes.string.isRequired,
    deviceType: PropTypes.string.isRequired,
    battery: PropTypes.string,
  }).isRequired,
  deviceCardReload: PropTypes.func.isRequired,
  groupCardReload: PropTypes.func.isRequired,
};

export default DeviceManagingForm;
