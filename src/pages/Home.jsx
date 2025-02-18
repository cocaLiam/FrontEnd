// src/pages/Home.jsx
import {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import RadioModal from "@/components/molecules/RadioModal";
import MultiSelectModal from "@/components/molecules/MultiSelectModal";
import GroupCard from "@/components/molecules/GroupCard";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import RefreshIcon from "@/components/atoms/icons/refreshIcon";
import BluetoothAddDevice from "@/components/atoms/icons/BluetoothAddDevice";

import MenuIcon from "@/components/atoms/icons/MenuIcon";
import SettingsIcon from "@/components/atoms/icons/SettingsIcon";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

import {
  andInterface,
  validateDeviceInfo,
  validateDeviceList,
  validateReadOrWriteData,
} from "@/utils/android/androidInterFace";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /** 단일선택 라디오 모달 */
  // 추가할 기기의 Group 선택
  const [addDeviceGroup, setAddDeviceGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(""); // 선택된 그룹
  // 추가할 기기 선택택
  const [addDevice, setAddDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(""); // 선택된 기기
  const [deviceScanList, setDeviceScanList] = useState([]); // Scan 된 DeviceList

  const [isMultiSelectModalOpen, setMultiSelectModalOpen] = useState(false); // 복수 선택 체크 박스

  const [renderingTargetGroupList, setRenderingTargetGroup] = useState([]); // HOME 화면에 렌더링 할 Group List
  const [userGroupList, setUserGroupList] = useState([]); // Filtering 에 사용 될 Group List

  const [connectedDeviceList, setConnectedDeviceList] = useState([]); // 연결된 DeviceList // 지금 안쓰임임
  const [deviceStatusList, setDeviceStatusList] = useState([]); // 연결된 기기의 StatusList
  // const connectedDeviceList = useRef([]);
  const [isAndroidInterfaceMounted, setIsAndroidInterfaceMounted] =
    useState(false); // AndroidInterface 가 마운팅 된 후 AndroidInterface 요청 처리

  /**
   * 디버깅용
   */
  useEffect(() => {
    console.log(
      `connectedDeviceList 상태 변경 : ${JSON.stringify(
        connectedDeviceList,
        null,
        2
      )}`
    );
  }, [connectedDeviceList]);

  useEffect(() => {
    console.log(
      `deviceStatusList 상태 변경 : ${JSON.stringify(
        deviceStatusList,
        null,
        2
      )}`
    );
  }, [deviceStatusList]);

  useEffect(() => {
    console.log(
      `deviceScanList 상태 변경 : ${JSON.stringify(deviceScanList, null, 2)}`
    );
  }, [deviceScanList]);
  /**
   * 디버깅용
   */

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const authStatus = useContext(AuthContext);

  // User의 userGroupList 를 가져오는 함수
  const fetchGroupList = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: `/api/user/getUserInfo`, // 로그인 엔드포인트
        method: "GET", // HTTP 메서드
        headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
      });

      setRenderingTargetGroup(responseData.userInfo.deviceGroupList);
      setUserGroupList(responseData.userInfo.deviceGroupList);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, [authStatus.token, sendRequest]);

  // 기기 추가 함수 -> BackEnd 정보전달
  const createDevice = useCallback(
    async (macAddress, deviceType, battery, selectedGroup) => {
      try {
        console.log(
          `createDevice `,
          macAddress,
          deviceType,
          battery,
          selectedGroup
        );
        setIsLoading(true); // 로딩 상태 시작
        await sendRequest({
          url: `/api/device/${authStatus.dbObjectId}/deviceCreate`, // API 엔드포인트
          method: "POST", // HTTP 메서드
          headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
          data: {
            deviceGroup: selectedGroup,
            macAddress,
            deviceType,
            battery,
          }, // 요청 데이터
        });
        // await fetchDeviceList();
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
        andInterface.reqDisconnect(macAddress, deviceType);
        andInterface.reqRemoveParing(macAddress, deviceType);
        console.log(`디바이스 추가 실패 : 자동 Disconnect 및 Paring 삭제`);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
        console.log(`createDevice END`);
      }
    },
    [authStatus.dbObjectId, authStatus.token, sendRequest]
  );

  // reqConnectedDevices 시 -> resConnectedDevices 로 Response
  const resScanStart = useCallback(
    async (data) => {
      try {
        console.log("resScanStart 받은 DATA : ", JSON.stringify(data, null, 2));

        if (!validateDeviceList(data).isValid) return false; // Paring Device 가 0 개 인 경우

        setDeviceScanList(data.deviceList)
        // const arrayTmp = []; // 배열 초기화를 반복문 밖으로 이동
        // for (let tmp of data.deviceList) {
        //   // deviceScanList에 같은 deviceType이 이미 있는지 체크
        //   arrayTmp.push(tmp.deviceType); // 배열에 추가
        //   setDeviceScanList(arrayTmp);
        // }
        return true; // Android로 반환
      } catch (error) {
        console.error(`에러 발생 1: ${error.message}`);
        return false; // Android로 반환
      }
    },
    // [deviceScanList]
    []
  );

  // reqConnect 시 -> resConnect 로 Response
  const resConnect = useCallback(async (data) => {
      try {
        console.log(`resConnect : ${JSON.stringify(data, null, 2)}`);
        // 데이터 유효성 검사
        const validation = validateDeviceInfo(data);

        if (!validation.isValid) {
          throw {
            status: 133,
          };
        }

        // 데이터가 유효하면 기기 생성
        await createDevice(
          data.macAddress,
          data.deviceType,
          "50",
          selectedGroup
        );

        return true; // Android로 반환
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
      } finally {
        setIsLoading(false); // 로딩 상태 종료
        setAddDeviceGroup(false); // AddDevice 화면 종료
        await fetchGroupList(); // GroupCard 리렌더링을 위해 fetchGroupList 호출
        console.log(`resConnect END`);
      }
    },
    [createDevice, fetchGroupList, selectedGroup]
  );

  // reqConnectedDevices 시 -> resConnectedDevices 로 Response
  const resConnectedDevices = useCallback(async (data) => {
    try {
      if (!validateDeviceList(data).isValid || data.deviceList.length === 0) {
        setConnectedDeviceList([]);
        console.log("유효하지 않거나 빈 리스트입니다. 상태를 유지합니다.");
        return false;
      }

      setConnectedDeviceList(data.deviceList);``

      for(let connectedDevice of data.deviceList){
        // 연결된 Device 들 정보 요청
        andInterface.reqReadData(connectedDevice.macAddress, connectedDevice.deviceType)
      }

      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  }, []);

  // onResume때 자동연결 시 -> resAutoConnect 로 Response
  const resAutoConnect = useCallback(async (data) => {
    try {
      console.log(
        `resAutoConnect 받은 DATA : ${Object.prototype.toString.call(
          data
        )} :${JSON.stringify(data, null, 2)}`
      );

      // 데이터 유효성 검사
      if (!validateDeviceInfo(data).isValid) {
        throw {
          status: 133,
        };
      }

      return true; // Android로 반환
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, []);

  // reqReadData 시 -> resReadData 로 Response
  const resReadData = useCallback(async (data) => {
    try {
      // 데이터 유효성 검사
      const validation = validateReadOrWriteData(data);

      if (!validation.isValid) {
        throw {
          status: 133,
        };
      }

      setDeviceStatusList((prevState) => {
        // 현재 기기의 macAddress가 이미 있는지 확인
        const existingDeviceIndex = prevState.findIndex(
          (item) => item.deviceInfo.macAddress === data.deviceInfo.macAddress
        );

        // 받은 데이터의 readData 문자열을 JSON으로 파싱
        const jsonStr = data.msg.readData.replace(/'/g, '"');
        data.msg.readData = JSON.parse(jsonStr);

        if (existingDeviceIndex === -1) {
          // 새로운 기기인 경우 추가
          return [...prevState, data];
        } else {
          // 이미 존재하는 기기인 경우 해당 기기의 데이터만 업데이트
          return prevState.map((item, index) => {
            if (index === existingDeviceIndex) {
              return {
                ...item, // 1. 기존 객체의 모든 속성을 복사
                msg: data.msg, // 2. msg 속성을 새로운 값으로 덮어쓰기
              };
            }
            return item;
          });
        }
      });

      console.log(`resReadData : ${JSON.stringify(data, null, 2)}`);
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  }, []);

  const bleScanStopProcess = useCallback(() => {
    try {
      andInterface.reqScanStop();
      setDeviceScanList([]);
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  }, []);

  // 처음 렌더링될 때 User의 userGroupList 를 가져오는 함수 ( 새로고침시 )
  useEffect(() => {
    async function fetchData() {
      await fetchGroupList();
    }
    fetchData();
  }, [fetchGroupList]);

  // 기기 추가 함수 -> Android 함수를 등록
  useEffect(() => {
    window.resConnect = resConnect;
    window.resConnectedDevices = resConnectedDevices;
    // window.resAutoConnect = resAutoConnect;
    window.resAutoConnect = () => andInterface.reqConnectedDevices();
    window.resReadData = resReadData;
    window.resScanStart = resScanStart;
    window.resScanStop = andInterface.resScanStop; // 안쓰는중
    setIsAndroidInterfaceMounted(true);

    return () => {
      delete window.resConnect;
      delete window.resConnectedDevices;
      delete window.resAutoConnect;
      delete window.resReadData;
      setIsAndroidInterfaceMounted(false);
    };
  }, [
    resConnect,
    resConnectedDevices,
    resAutoConnect,
    resReadData,
    resScanStart,
  ]);

  useEffect(() => {
    if (isAndroidInterfaceMounted) {
      // andInterface.reqConnectedDevices();
    }
  }, [isAndroidInterfaceMounted]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <RadioModal // 그룹 선택창
        isOpen={addDeviceGroup}
        onClose={() => {
          setAddDeviceGroup(false);
          bleScanStopProcess();
        }}
        onConfirm={() => {
          setAddDevice(true);
          andInterface.reqScanStart(); //
        }}
        title={"Group 선택"}
        contents={userGroupList}
        // contents={["aa","bb","cc"]}
        setSelectedContent={(target) => {
          setSelectedGroup(target);
          console.log(`선택된 그룹 : ${target}`);
        }}
        confirmButtonContent={"선택"}
      />
      <RadioModal // 기기 선택창
        isOpen={addDevice}
        onClose={() => {
          setAddDevice(false);
          bleScanStopProcess();
        }}
        onConfirm={() => {
          const tmp = deviceScanList.find(device => device.deviceType == selectedDevice)
          andInterface.reqConnect(tmp.macAddress, tmp.deviceType)
          bleScanStopProcess();
          setAddDevice(false);
        }}
        title={"기기 선택"}
        contents={deviceScanList.map(device => device.deviceType)}
        // contents={["aa","bb","cc"]}
        setSelectedContent={(target) => {
          setSelectedDevice(target);
          console.log(`선택된 기기 : ${target}`);
          console.log(JSON.stringify(deviceScanList.find(device => device.deviceType == target),null,2));
        }}
        confirmButtonContent={"추가"}
      />
      <MultiSelectModal
        isOpen={isMultiSelectModalOpen}
        onClose={() => setMultiSelectModalOpen(false)}
        onConfirm={(selectedItems) => {
          if (selectedItems.length > 0) {
            setRenderingTargetGroup(selectedItems);
          }
          setMultiSelectModalOpen(false);
        }}
        title="필터링 그룹 선택"
        contents={userGroupList}
        confirmButtonContent="완료"
      />

      <div className="flex flex-row-reverse justify-between gap-1 mt-1 mb-4 ml-2 mr-2">
        <div className="flex flex-row gap-1">
          <ButtonWithIcon
            icon={MenuIcon}
            onClick={() => setMultiSelectModalOpen(true)}
          />
          <ButtonWithIcon
            icon={BluetoothAddDevice}
            onClick={() => setAddDeviceGroup(true)}
          />
        </div>
        <ButtonWithIcon
          icon={SettingsIcon}
          content="기기 상태 동기화"
          onClick={() => {
            console.log("화면 갱신 버튼 호출");
            andInterface.reqConnectedDevices();
          }}
        />
      </div>

      {/* <div className="flex flex-row-reverse gap-1 mt-1 mb-4 mr-2">
        <ButtonWithIcon
          icon={BluetoothAddDevice}
          onClick={() => setAddDeviceGroup(true)}
        />
        <ButtonWithIcon
          icon={MenuIcon}
          onClick={() => setMultiSelectModalOpen(true)}
        />
        <ButtonWithIcon
          icon={SettingsIcon}
          onClick={() => {andInterface.reqConnectedDevices();}}
        />
      </div> */}

      {/* <div className="flex flex-col gap-4 px-6 py-4"> */}
      <div className="flex flex-col">
        {/* userGroupList가 불러와진 이후 GroupCard 렌더링링 */}

        {renderingTargetGroupList.length > 0 && (
          <GroupCard
            userGroupList={renderingTargetGroupList} // 그룹 리스트 전달
            groupCardReload={fetchGroupList} // groupCard 리렌더링
            // connectedDeviceList={connectedDeviceList}
            deviceStatusList={deviceStatusList}
          />
        )}
      </div>
    </>
  );
}
