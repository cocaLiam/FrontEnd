// src/pages/Home.jsx
import { useEffect, useState, useContext, useCallback } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import RadioModal from "@/components/molecules/RadioModal";
import GroupCard from "@/components/molecules/GroupCard";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import BluetoothAddDevice from "@/components/atoms/icons/BluetoothAddDevice";
import MenuIcon from "@/components/atoms/icons/MenuIcon";

import { handleError } from "@/utils/errorHandler";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRadioModalOpen, setRadioModalOpen] = useState(false); // 단일일 선택 전용
  const [selectedRadioButton, getSelectedContent] = useState("");

  // const [isRadioModalOpen, setRadioModalOpen] = useState(false); // 다중 선택 전용

  const [userGroupList, setUserGroupList] = useState([]); // DeviceCard를 렌더링할 데이터 상태
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

      setUserGroupList(responseData.userInfo.deviceGroupList);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, [authStatus.token, sendRequest]);

  // 처음 렌더링될 때 User의 userGroupList 를 가져오는 함수 ( 새로고침시 )
  useEffect(() => {
    async function fetchData() {
      await fetchGroupList();
    }
    fetchData();
  }, []);

  return (
    <>
      {userGroupList && (
        <RadioModal
          isOpen={isRadioModalOpen}
          onClose={() => setRadioModalOpen(false)}
          onConfirm={() =>
            // handleGroupAction("deviceGroupUpdate", selectedRadioButton)
            console.log("")
          }
          title={"Group 변경"}
          contents={userGroupList}
          // contents={["aa","bb","cc"]}
          getSelectedContent={(target) => getSelectedContent(target)}
        />
      )}

      <div className="flex flex-row-reverse gap-1 mt-1 mb-4 mr-2">
        <ButtonWithIcon icon={BluetoothAddDevice} onClick={()=>setRadioModalOpen(true)}/>
        <ButtonWithIcon icon={MenuIcon} onClick={()=>console.log("= 버튼 클릭")}/>
      </div>

      {/* <div className="flex flex-col gap-4 px-6 py-4"> */}
      <div className="flex flex-col">
        {isLoading && <LoadingSpinner />}
        <ErrorModal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          content={errorMessage}
        />
        {/* userGroupList가 불러와진 이후 GroupCard 렌더링링 */}
        {userGroupList.length > 0 && (
          <GroupCard
            userGroupList={userGroupList} // 그룹 리스트 전달
            groupCardReload={fetchGroupList} // groupCard 리렌더링
          />
        )}
      </div>
    </>
  );
}
