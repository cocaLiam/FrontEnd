// src/pages/Home.jsx
import { useEffect, useState, useContext, useCallback } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import GroupCard from "@/components/molecules/GroupCard";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { handleError } from "@/utils/errorHandler";
import { andInterface } from "@/utils/android/androidInterFace";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userGroupList, setUserGroupList] = useState([]); // DeviceCard를 렌더링할 데이터 상태

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  const auth = useContext(AuthContext);

  // User의 userGroupList 를 가져오는 함수
  const fetchDeviceGroupList = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: `/api/user/getUserInfo`, // 로그인 엔드포인트
        method: "GET", // HTTP 메서드
        headers: { Authorization: `Bearer ${auth.token}` }, // 현재 토큰을 Authorization 헤더에 포함
      });

      const userGroupList = responseData.userInfo.device_group_list;

      setUserGroupList(userGroupList);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, [auth.token, sendRequest]);

  // 처음 렌더링될 때 User의 userGroupList 를 가져오는 함수 ( 새로고침시 )
  useEffect(() => {
    async function fetchData() {
      await fetchDeviceGroupList();
    }
    fetchData();
  }, [fetchDeviceGroupList]);

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <GroupCard
        userGroupList={userGroupList} // 그룹 리스트 전달달
      />

    </div>
  );
}
