// @/components/molecules/my_forms/UserInfoSettingForm
import React, { useCallback, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import InputModal from "@/components/molecules/InputModal";
import ErrorModal from "@/components/molecules/ErrorModal";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import CloseButton from "@/components/atoms/CloseButton";

import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

const UserInfoSettingForm = ({ setUserInfoSettingFormOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfo, setUserInfo] = useState({});

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isInputModalOpen, setInputModalOpen] = useState(false);
  const [selectedInputType, setselectedInputType] = useState("");
  const [InputPlaceHolder, setInputPlaceHolder] = useState("");

  const authStatus = useContext(AuthContext);
  const { sendRequest } = useHttpHook();

  const onClose = () => {
    setUserInfoSettingFormOpen(false);
  };

  // 사용자 정보를 업데이트하는 함수
  const updateUserInfo = useCallback(
    async ({ ...kwargs }) => {
      setIsLoading(true);
      try {
        await sendRequest({
          url: "/api/user/updateUserInfo", // 로그인 엔드포인트
          method: "PATCH", // HTTP 메서드
          data: {
            dbObjectId: authStatus.dbObjectId,
            ...kwargs,
          }, // 요청 데이터
          headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
        });
        // 업데이트된 데이터를 userInfo에 반영
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          ...kwargs,
        }));
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    },
    [authStatus.token, authStatus.dbObjectId, sendRequest]
  );

  // 사용자 정보를 가져오는 함수
  const getUserInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: "/api/user/getUserInfo",
        method: "GET",
        headers: { Authorization: `Bearer ${authStatus.token}` },
      });
      setUserInfo(responseData.userInfo); // 초기 사용자 정보 설정
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  }, [authStatus.token, sendRequest]);

  // 컴포넌트가 처음 렌더링될 때 사용자 정보 가져오기
  useEffect(() => {
    const callGetUserInfo = async () => {
      await getUserInfo();
    };
    callGetUserInfo();
  }, [getUserInfo]);

  return (
    <>
      {/* 모달 컨테이너 배경화면 (오버레이) */}
      <div
        className="fixed inset-0 z-30 w-full h-full bg-black bg-opacity-30"
        onClick={() => setUserInfoSettingFormOpen(false)}
      />
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />

      {/* 모달 컨테이너 // overflow-y-auto 위아래 스크롤(Scroll)*/}
      <div className="absolute z-40 inline-block w-10/12 max-w-lg p-2 mx-auto overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl max-h-96 top-1/3 left-1/2 ">
        {/* <div className="absolute z-40 inline-block w-10/12 max-w-lg p-2 mx-auto overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl max-h-[calc(100vh-100px)] top-1/3 left-1/2"> */}
        <InputModal
          isOpen={isInputModalOpen}
          onConfirm={updateUserInfo}
          setClose={() => setInputModalOpen(false)}
          title={`${selectedInputType} 정보 변경`}
          content=""
          inputTextType={selectedInputType}
          placeHolder={InputPlaceHolder}
          hintList={[]}
          setPasswordCheck={true}
        />

        <CloseButton onClose={onClose} />
        <div className="flex flex-col py-1">
          <h2 className="px-2 mb-4 text-lg font-bold text-center text-black">
            - 계정 관리 -
          </h2>

          <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
            <span className="text-sm text-black">{userInfo.userName}</span>
            <button
              className="text-black bg-orange-300 hover:bg-orange-400"
              onClick={() => {
                setInputModalOpen(true);
                setselectedInputType("userName");
                setInputPlaceHolder("이름을 입력하세요");
              }}
            >
              이름 변경하기
            </button>
          </div>

          <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
            <span className="text-sm text-black">{userInfo.userEmail}</span>
            <button
              className="text-black bg-orange-300 hover:bg-orange-400"
              onClick={() => {
                setInputModalOpen(true);
                setselectedInputType("userEmail");
                setInputPlaceHolder("example@example.com");
              }}
            >
              이메일 변경하기
            </button>
          </div>

          <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
            <span className="text-sm text-black">{"********"}</span>
            <button
              className="text-black bg-orange-300 hover:bg-orange-400"
              onClick={() => {
                setInputModalOpen(true);
                setselectedInputType("newPassword");
                setInputPlaceHolder("6자리 이상 비밀번호");
              }}
            >
              비밀번호 변경하기
            </button>
          </div>

          <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
            <span className="text-sm text-black">{userInfo.homeAddress}</span>
            <button
              className="text-black bg-orange-300 hover:bg-orange-400"
              onClick={() => {
                setInputModalOpen(true);
                setselectedInputType("homeAddress");
                setInputPlaceHolder("집 주소를 입력하세요");
              }}
            >
              집주소 변경하기
            </button>
          </div>

          <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
            <span className="text-sm text-black">{userInfo.phoneNumber}</span>
            <button
              className="text-black bg-orange-300 hover:bg-orange-400"
              onClick={() => {
                setInputModalOpen(true);
                setselectedInputType("phoneNumber");
                setInputPlaceHolder("010-1234-5678");
              }}
            >
              휴대폰 번호 변경하기
            </button>
          </div>
        </div>
        {/* 스크롤 힌트 */}
        {/* <div className="sticky text-lg font-bold text-center text-red-600 transform -translate-x-1/2 bottom-2 left-1/2 animate-bounce"> */}
        <div className="sticky bottom-0 text-lg font-bold text-center text-gray-500 transform -translate-x-1/2 left-1/2 animate-bounce">
          ↓
        </div>
      </div>
    </>
  );
};

UserInfoSettingForm.propTypes = {
  setUserInfoSettingFormOpen: PropTypes.func.isRequired,
};

export default UserInfoSettingForm;
