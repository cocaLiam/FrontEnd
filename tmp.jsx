import React, { useCallback, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import InputModal from "@/components/molecules/InputModal";
import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import CloseButton from "@/components/atoms/CloseButton";

import { handleError } from "@/utils/errorHandler";
import { AuthContext } from "@/context/AuthContext";
import { useHttpHook } from "@/hooks/useHttpHook";

const GroupManagingForm = ({ setGroupManagingFormOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfo, setUserInfo] = useState({});

  const [isInputModalOpen, setInputModalOpen] = useState(false);

  const [inputModalConfig, setInputModalConfig] = useState({
    type: "",
    placeholder: "",
    currentGroup: "",
  });

  const authStatus = useContext(AuthContext);
  const { sendRequest } = useHttpHook();

  const onClose = () => setGroupManagingFormOpen(false);

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
      setIsLoading(true);
      try {
        let url, data, method;
        switch (actionType) {
          case "create": {
            // Group 생성 함수
            url = "/api/user/createGroup";
            data = {
              dbObjectId: authStatus.dbObjectId,
              createTargetGroupName: inputValue,
            };
            method = "POST";
            break;
          }
          case "update": {
            // Group 수정 함수
            url = "/api/user/updateGroup";
            data = {
              dbObjectId: authStatus.dbObjectId,
              currentGroup: inputModalConfig.currentGroup,
              updateTargetGroupName: inputValue,
            };
            method = "PATCH";
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

        setUserInfo((prev) => ({ ...prev, ...responseData.userInfo }));
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [authStatus, inputModalConfig.currentGroup, sendRequest]
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

  const openInputModal = (type, placeholder, currentGroup = "") => {
    setInputModalConfig({ type, placeholder, currentGroup });
    setInputModalOpen(true);
  };

  return (
    <>
      {/* 모달 컨테이너 배경화면 (오버레이) */}
      <div
        className="fixed inset-0 z-30 w-full h-full bg-black bg-opacity-30"
        onClick={onClose}
      />

      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />

      {/* 모달 컨테이너 // overflow-y-auto 위아래 스크롤(Scroll)*/}
      <div className="absolute z-50 inline-block w-10/12 max-w-lg p-2 mx-auto overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl max-h-96 top-1/3 left-1/2 ">
        <CloseButton onClose={onClose} />

        <InputModal
          isOpen={isInputModalOpen}
          onConfirm={(inputValue) =>
            handleGroupAction(inputModalConfig.currentGroup, inputValue)
          }
          setClose={() => setInputModalOpen(false)}
          title={inputModalConfig.type}
          inputTextType={inputModalConfig.type}
          placeHolder={inputModalConfig.placeholder}
          hintList={["안방", "거실", "아기방"]}
          setPasswordCheck={false}
        />

        <div className="flex flex-col py-1">
          <h2 className="px-2 mb-4 text-lg font-bold text-center text-black">
            - 그룹 관리 -
          </h2>
          <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
            <div className="flex flex-col">
              {(userInfo.deviceGroupList || []).map((group, index) => (
                <span key={index} className="flex-wrap text-sm text-black">
                  {index + 1} : {group}
                </span>
              ))}
            </div>
            <button
              className="text-black bg-orange-300 hover:bg-orange-400"
              onClick={() =>
                openInputModal(
                  "createGroup",
                  "ex) 안방, 거실, 아기방 ...",
                  "create"
                )
              }
            >
              새로운 그룹 추가
            </button>
          </div>
          {(userInfo.deviceGroupList || []).map((group, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800"
            >
              <span className="flex-wrap text-sm text-black">
                {index + 1}. {group}
              </span>
              <button
                className="text-black bg-orange-300 hover:bg-orange-400"
                onClick={() => openInputModal("updateGroup", group, "update")}
              >
                해당 그룹 변경
              </button>
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 text-lg font-bold text-center text-gray-500 transform -translate-x-1/2 left-1/2 animate-bounce">
          ↓
        </div>
      </div>
    </>
  );
};

GroupManagingForm.propTypes = {
  setGroupManagingFormOpen: PropTypes.func.isRequired,
};

export default GroupManagingForm;
