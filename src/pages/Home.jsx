// src/pages/Home.jsx
import { useEffect, useState, useContext, useCallback, useRef } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import RadioModal from "@/components/molecules/RadioModal";
import MultiSelectModal from "@/components/molecules/MultiSelectModal";
import GroupCard from "@/components/molecules/GroupCard";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import BluetoothAddDevice from "@/components/atoms/icons/BluetoothAddDevice";

import MenuIcon from "@/components/atoms/icons/MenuIcon";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

import {
  andInterface,
  validateDeviceInfo,
  validateDeviceList,
} from "@/utils/android/androidInterFace";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isRadioModalOpen, setRadioModalOpen] = useState(false); // 단일 선택 라디오 버튼
  const [selectedSelectedContent, setSelectedContent] = useState(""); // 단일 선택 된 타겟

  const [isMultiSelectModalOpen, setMultiSelectModalOpen] = useState(false); // 복수 선택 체크 박스

  const [RenderingTargetGroupList, setRenderingTargetGroup] = useState([]); // HOME 화면에 렌더링 할 Group List
  const [userGroupList, setUserGroupList] = useState([]); // Filtering 에 사용 될 Group List

  // const [connectedDeviceList, setConnectedDeviceList] = useState([]); // 연결된 DeviceList를 저장할 List
  const connectedDeviceList = useRef([]);
  const [isAndroidInterfaceMounted, setIsAndroidInterfaceMounted] =
    useState(false); // AndroidInterface 가 마운팅 된 후 AndroidInterface 요청 처리
    
  /**
   * 디버깅용
   */
  useEffect(() => {
    console.log(`ConnectList 업데이트 22: ${JSON.stringify(connectedDeviceList.current,null,2)}`);
    console.log(`Length : ${connectedDeviceList.current.length}`)
  }, [connectedDeviceList.current, connectedDeviceList]);
  /**
   * 디버깅용
   */

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const authStatus = useContext(AuthContext);

  const setConnectedDeviceList = useCallback(async (data) => {
    connectedDeviceList.current = data;
    console.log(
      `setConnectedDeviceList 호출 [${Object.prototype.toString.call(data)}] : ${JSON.stringify(data, null, 2)}`
    );
    console.log(
      `setConnectedDeviceList 호출 [${Object.prototype.toString.call(connectedDeviceList)}] : ${JSON.stringify(connectedDeviceList, null, 2)}`);
  }, []);
  
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
        setIsLoading(true); // 로딩 상태 시작
        const responseData = await sendRequest({
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
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    },
    [authStatus.dbObjectId, authStatus.token, sendRequest]
  );

  // 기기 추가 함수 -> Android 로 부터 Connect Response를 받는 함수
  const resConnect = useCallback(
    async (data) => {
      try {
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
          selectedSelectedContent
        );

        return true; // Android로 반환
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
      } finally {
        setIsLoading(false); // 로딩 상태 종료
        setRadioModalOpen(false); // AddDevice 화면 종료
        await fetchGroupList(); // GroupCard 리렌더링을 위해 fetchGroupList 호출
      }
    },
    [createDevice, fetchGroupList, selectedSelectedContent]
  );
  
  const tt = useCallback(async (data) => {
    await setConnectedDeviceList(data.deviceList);
  },[setConnectedDeviceList])

  const resConnectedDevices = useCallback(async (data) => {
    try {
      if (!validateDeviceList(data).isValid) return false; // Conneted Device 가 0 개 인 경우
      // if (validateDeviceList(data).isValid) {
      //   // setConnectedDeviceList(data.deviceList)
      //   // connectedDeviceList = data.deviceList;
      //   console.log(
      //     `ConnectList 업데이트 22 [${Object.prototype.toString.call(
      //       data.deviceList
      //     )}] : ${JSON.stringify(data.deviceList, null, 2)}`
      //   );
      //   setConnectedDeviceList(data.deviceList);
      // }

      console.log(
        `ConnectList 업데이트 11 [${Object.prototype.toString.call(
          data.deviceList
        )}] : ${JSON.stringify(data.deviceList, null, 2)}`
      );
      // await makeAsync(data.deviceList);
      await tt(data.deviceList);
      // setConnectedDeviceList(data.deviceList)
      await setConnectedDeviceList(data.deviceList)
      // setConnectedDeviceList(
      //   [
      //     {
      //       "deviceType": "ccb_v1",
      //       "macAddress": "9C:95:6E:40:0F:75"
      //     }
      //   ]
      // )

      // setConnectedDeviceList((prevList) => {
      //   console.log("Previous list:", prevList);
      //   console.log("New data list:", data.deviceList);
      //   return [...prevList, ...data.deviceList]; // 상태를 덮어쓰지 않고 새 데이터 병합
      // });
      
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  }, [tt,setConnectedDeviceList]);

  // 기기 추가 함수 -> Android 로 부터 Connect Response를 받는 함수
  const resAutoConnect = useCallback(async (data) => {
    try {
      // 시작하자마자 자동연결을 해서 resAutoConnect 를 받지를 못함함
      console.log(
        "----------------------------------------------------------------------------"
      );
      console.log(
        `resAutoConnect 받은 DATA : ${JSON.stringify(data, null, 2)}`
      );

      // 데이터 유효성 검사
      if (!validateDeviceInfo(data).isValid) {
        throw {
          status: 133,
        };
      }

      // 데이터가 유효하면 기기 생성

      return true; // Android로 반환
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, []);

  // 처음 렌더링될 때 User의 userGroupList 를 가져오는 함수 ( 새로고침시 )
  useEffect(() => {
    async function fetchData() {
      await fetchGroupList();
    }
    fetchData();
  }, []);

  // 기기 추가 함수 -> Android 함수를 등록
  useEffect(() => {
    console.log("## ANDROID RESPONSE INTERFACE 등록");
    // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.resConnect = resConnect;
    window.resConnectedDevices = resConnectedDevices;
    window.resAutoConnect = resAutoConnect;

    setIsAndroidInterfaceMounted(true);

    // Android WebView 리로드 요청  // window에서 한번 삭제한 함수명들은 재등록 하려면 WebView Reload 를 요청해야한다.
    // andInterface.pubReloadWebView();

    // return () => {   // 버그가 있는게 한번 삭제하면 다시 등록해도 등록이 안됨
    //   console.log("## ANDROID RESPONSE INTERFACE 해제")
    //   // 페이지가 언마운트(페이지이동)될 때 등록된 함수 제거
    //   delete window.resConnect;
    //   delete window.resConnectedDevices;
    //   delete window.resAutoConnect;
    //   setIsAndroidInterfaceMounted(false);
    // };
  }, []);

  useEffect(() => {
    console.log(`## ANDROID REQUEST 요청 ${isAndroidInterfaceMounted}`);
    if (isAndroidInterfaceMounted) {
      andInterface.reqConnectedDevices();
    }
    // andInterface.reqParingInfo()
  }, [isAndroidInterfaceMounted]);

  // useEffect(() => {
  //   const delayedRequest = async () => {
  //       console.log(`## ANDROID REQUEST 요청 ${isAndroidInterfaceMounted}`);
  //       if (isAndroidInterfaceMounted) {
  //           await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 딜레이
  //           andInterface.reqConnectedDevices();
  //       }
  //   };

  //   delayedRequest();
  // }, [isAndroidInterfaceMounted]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <RadioModal
        isOpen={isRadioModalOpen}
        onClose={() => setRadioModalOpen(false)}
        onConfirm={() => {
          andInterface.reqConnect(); // 기기 추가 함수 -> Android 요청
        }}
        title={"추가할 기기의 Group 지정"}
        contents={userGroupList}
        // contents={["aa","bb","cc"]}
        setSelectedContent={(target) => setSelectedContent(target)}
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

      <div className="flex flex-row-reverse gap-1 mt-1 mb-4 mr-2">
        <ButtonWithIcon
          icon={BluetoothAddDevice}
          onClick={() => setRadioModalOpen(true)}
        />
        <ButtonWithIcon
          icon={MenuIcon}
          onClick={() => setMultiSelectModalOpen(true)}
        />
      </div>

      {/* <div className="flex flex-col gap-4 px-6 py-4"> */}
      <div className="flex flex-col">
        {/* userGroupList가 불러와진 이후 GroupCard 렌더링링 */}

        {/* {(<GroupCard
            userGroupList={RenderingTargetGroupList} // 그룹 리스트 전달
            groupCardReload={fetchGroupList} // groupCard 리렌더링
            connectedDeviceList={connectedDeviceList}
            // connectedDeviceList={connectedDeviceList.current}
          />
        )} */}
        {/* {RenderingTargetGroupList.length > 0 && (
          <GroupCard
            userGroupList={RenderingTargetGroupList} // 그룹 리스트 전달
            groupCardReload={fetchGroupList} // groupCard 리렌더링
            connectedDeviceList={connectedDeviceList}
            // connectedDeviceList={connectedDeviceList.current}
          />
        )} */}
        {RenderingTargetGroupList.length > 0 && (
          connectedDeviceList.current.length > 0 && <GroupCard
            userGroupList={RenderingTargetGroupList} // 그룹 리스트 전달
            groupCardReload={fetchGroupList} // groupCard 리렌더링
            // connectedDeviceList={connectedDeviceList}
            connectedDeviceList={connectedDeviceList.current}
          />
        )}
      </div>
    </>
  );
}
