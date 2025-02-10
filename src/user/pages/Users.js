import React, { useEffect, useState, useCallback } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import DeviceCard from "./DeviceCard";

import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  andInterface,
  validateDeviceList,
} from "../../shared/util/androidInterface";

import "./Users.css"; // CSS 파일 추가

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [connectedDeviceList, setConnectedDeviceList] = useState();

  useEffect(() => {
    console.log(
      `상태변화 감지 : ${JSON.stringify(connectedDeviceList, null, 2)}`
    );
  }, [connectedDeviceList]);

  const resConnectedDevices = useCallback(
    async (data) => {
      try {
        console.log(
          `ConnectList 업데이트 11 [${Object.prototype.toString.call(
            data.deviceList
          )}] : ${JSON.stringify(data.deviceList, null, 2)}`
        );

        if (!validateDeviceList(data).isValid || data.deviceList.length === 0) {
          console.log("유효하지 않거나 빈 리스트입니다. 상태를 유지합니다.");
          return false;
        }

        setConnectedDeviceList((prevList) => {
          const newList = [...data.deviceList]; // 항상 새로운 배열 생성
          console.log("이전 상태:", prevList);
          console.log("새로운 상태:", newList);

          // 상태가 동일한지 비교
          if (JSON.stringify(prevList) === JSON.stringify(newList)) {
            console.log("동일한 상태로 인해 업데이트 건너뜀");
            // return prevList; // 상태를 업데이트하지 않음
            return [
              { deviceType: "안방불11", macAddress: "11:11:11:11:11:11" },
            ];
          }

          return newList; // 상태 변경
        });

        console.log(
          `ConnectList 업데이트 12 [${Object.prototype.toString.call(
            connectedDeviceList
          )}] : ${JSON.stringify(connectedDeviceList, null, 2)}`
        );

        return true; // Android로 반환
      } catch (error) {
        console.error(`에러 발생 1: ${error.message}`);
        return false; // Android로 반환
      }
    },
    [setConnectedDeviceList, connectedDeviceList]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BASE}${process.env.REACT_APP_USERS_ROUTE}${process.env.REACT_APP_ROOT}`
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
    console.log(" -- fetchUsers -- ");

    // // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.resConnect = andInterface.resConnect;
    window.resParingInfo = andInterface.resParingInfo;
    window.resReadData = andInterface.resReadData;
    window.subObserveData = andInterface.subObserveData;
    window.resConnectedDevices = resConnectedDevices;
  }, [sendRequest, resConnectedDevices]);

  return (
    <React.Fragment>
      <ErrorModal showError={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button
          className="add-device-button"
          // onClick={() => andInterface.pubToasting("APP API : Web to APP")}
          onClick={() =>
            andInterface.pubSendData("55:55:55:55", "Device_1", {
              key_web: "val_Web",
            })
          }
        >
          Add Device
        </button>
        {/* DeviceCard 클릭 버튼 */}
        <div className="grid grid-cols-2 gap-2 px-1 py-7">
          {(connectedDeviceList || []).map((deviceInfo, index) => (
            <DeviceCard
              key={deviceInfo.id || index} // 고유한 키 설정
              deviceInfo={{
                macAddress: deviceInfo.macAddress,
                deviceType: deviceInfo.deviceName,
              }} // Device 이름 또는 기본 텍스트
              connectedDeviceList={connectedDeviceList} // 연결되어 있는 device들 List
            />
            // <DeviceCard
            //   key={deviceInfo.id || index} // 고유한 키 설정
            //   deviceInfo={{
            //     deviceGroup: deviceInfo.deviceGroup,
            //     macAddress: deviceInfo.macAddress,
            //     deviceName: deviceInfo.deviceName,
            //     deviceType: deviceInfo.deviceType,
            //     battery: deviceInfo.battery,
            //   }} // Device 이름 또는 기본 텍스트
            //   deviceCardReload={fetchDeviceList} // deviceCard 리렌더링
            //   groupCardReload={groupCardReload} // groupCard 리렌더링
            //   connectedDeviceList={connectedDeviceList} // 연결되어 있는 device들 List
            // />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Users;
