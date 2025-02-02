// @/components/molecules/my_forms/GroupManagingForm
import React, { useCallback, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import InputModal from "@/components/molecules/InputModal";
import ErrorModal from "@/components/molecules/ErrorModal";
import ConfirmModal from "@/components/molecules/ConfirmModal";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import CloseButton from "@/components/atoms/CloseButton";

import { handleError } from "@/utils/errorHandler";
import { AuthContext } from "@/context/AuthContext";
import { useHttpHook } from "@/hooks/useHttpHook";

const GroupManagingForm = ({ setGroupManagingFormOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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

  const handleConfirm = () => {
    handleGroupAction("deleteGroup", "");
    setIsConfirmModalOpen(false);
  };

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
      console.log(` actionType  :: ${actionType}`);
      console.log(` inputValue  :: ${inputValue}`);
      console.log(` inputModalConfig  :: ${inputModalConfig}`);
      console.log(
        ` inputModalConfig  :: ${JSON.stringify(inputModalConfig, null, 2)}`
      );
      setIsLoading(true);
      try {
        let url, data, method;
        switch (actionType) {
          case "createGroup": {
            // Group 생성 함수
            url = "/api/user/createGroup";
            data = {
              dbObjectId: authStatus.dbObjectId,
              createTargetGroupName: inputValue,
            };
            method = "POST";
            break;
          }
          case "updateGroup": {
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
          case "deleteGroup": {
            // Group 삭제 함수
            url = "/api/user/deleteGroup";
            data = {
              dbObjectId: authStatus.dbObjectId,
              deleteTargetGroupName: inputModalConfig.currentGroup,
            };
            method = "DELETE";
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
    [authStatus, inputModalConfig, sendRequest]
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
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title="작업 확인"
        content="정말 이 작업을 진행하시겠습니까?"
      />

      {/* 모달 컨테이너 // overflow-y-auto 위아래 스크롤(Scroll)*/}
      <div className="absolute z-40 inline-block w-10/12 max-w-lg p-2 mx-auto overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl max-h-96 top-1/3 left-1/2 ">
        <CloseButton onClose={onClose} />

        <InputModal
          isOpen={isInputModalOpen}
          onConfirm={(inputValue) =>
            handleGroupAction(inputModalConfig.type, inputValue)
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

          {/* <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800"> */}
          <div className="flex items-center p-1 mb-4 bg-white border border-gray-800">
            <div className="flex flex-col">
              {(userInfo.deviceGroupList || []).map((group, index) => (
                <span key={index} className="flex-wrap text-sm text-black">
                  {index + 1} : {group}
                </span>
              ))}
            </div>
            <div className="ml-auto">
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
          </div>

          {(userInfo.deviceGroupList || []).map((group, index) => (
            <div
              key={index}
              // className="flex items-center justify-between p-1 mb-2 bg-white border border-gray-800"
              className="flex items-center p-1 mb-2 bg-white border border-gray-800"
            >
              <span className="flex-wrap text-sm text-black">
                {group}
                {/* {index + 1}. {group} */}
              </span>
              <div className="ml-auto">
                <button
                  className="text-black bg-orange-300 text- hover:bg-orange-400"
                  onClick={() => openInputModal("updateGroup", "변경", group)}
                >
                  변경
                </button>
                <button
                  className="text-black bg-orange-300 hover:bg-orange-400"
                  onClick={() => {
                    setIsConfirmModalOpen(true);
                    setInputModalConfig({
                      type: "deleteGroup",
                      placeholder: "삭제",
                      currentGroup: group,
                    });
                  }}
                >
                  삭제
                </button>
              </div>
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

// import React, { useCallback, useState, useContext, useEffect } from "react";
// import PropTypes from "prop-types";

// import InputModal from "@/components/molecules/InputModal";
// import ErrorModal from "@/components/molecules/ErrorModal";

// import LoadingSpinner from "@/components/atoms/LoadingSpinner";
// import CloseButton from "@/components/atoms/CloseButton";

// import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

// import { AuthContext } from "@/context/AuthContext";

// import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

// const GroupManagingForm = ({ setGroupManagingFormOpen }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [userInfo, setUserInfo] = useState({});

//   const [isInputModalOpen, setInputModalOpen] = useState(false);

//   const [InputPlaceHolder, setInputPlaceHolder] = useState("");
//   const [selectedInputType, setselectedInputType] = useState("");
//   const [selectedCurrentGroup, setselectedCurrentGroup] = useState("");

//   const authStatus = useContext(AuthContext);
//   const { sendRequest } = useHttpHook();

//   const onClose = () => setGroupManagingFormOpen(false);

//   // 사용자 정보를 업데이트하는 함수
//   const createGroup = useCallback(
//     async (inputValue) => {
//       console.log(inputValue);
//       setIsLoading(true);
//       try {
//         const responseData = await sendRequest({
//           url: "/api/user/createGroup", // 로그인 엔드포인트
//           method: "POST", // HTTP 메서드
//           data: {
//             dbObjectId: authStatus.dbObjectId,
//             createTargetGroupName: inputValue,
//           }, // 요청 데이터
//           headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
//         });
//         // 업데이트된 데이터를 userInfo에 반영
//         setUserInfo((prevUserInfo) => ({
//           ...prevUserInfo,
//           ...responseData.userInfo,
//         }));
//       } catch (err) {
//         handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
//       } finally {
//         setIsLoading(false); // 로딩 상태 종료
//       }
//     },
//     [authStatus.token, authStatus.dbObjectId, sendRequest]
//   );

//   // 사용자 정보를 업데이트하는 함수
//   const updateGroup = useCallback(
//     async (selectedCurrentGroup, inputValue) => {
//       setIsLoading(true);
//       console.log(`currentGroup : ${selectedCurrentGroup}`);
//       console.log(`updateTargetGroupName : ${inputValue}`);
//       try {
//         const responseData = await sendRequest({
//           url: "/api/user/updateGroup", // 로그인 엔드포인트
//           method: "PATCH", // HTTP 메서드
//           data: {
//             dbObjectId: authStatus.dbObjectId,
//             currentGroup: selectedCurrentGroup,
//             updateTargetGroupName: inputValue,
//           }, // 요청 데이터
//           headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
//         });
//         // 업데이트된 데이터를 userInfo에 반영
//         setUserInfo((prevUserInfo) => ({
//           ...prevUserInfo,
//           ...responseData.userInfo,
//         }));
//       } catch (err) {
//         handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
//       } finally {
//         setIsLoading(false); // 로딩 상태 종료
//       }
//     },
//     [authStatus.token, authStatus.dbObjectId, sendRequest]
//   );

//   // 사용자 정보를 가져오는 함수
//   const getUserInfo = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const responseData = await sendRequest({
//         url: "/api/user/getUserInfo",
//         method: "GET",
//         headers: { Authorization: `Bearer ${authStatus.token}` },
//       });
//       setUserInfo(responseData.userInfo); // 초기 사용자 정보 설정
//     } catch (err) {
//       handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
//     } finally {
//       setIsLoading(false); // 로딩 상태 종료
//     }
//   }, [authStatus.token, sendRequest]);

//   // 컴포넌트가 처음 렌더링될 때 사용자 정보 가져오기
//   useEffect(() => {
//     const callGetUserInfo = async () => {
//       await getUserInfo();
//     };
//     callGetUserInfo();
//   }, [getUserInfo]);

//   return (
//     <>
//       {/* 모달 컨테이너 배경화면 (오버레이) */}
//       <div
//         className="fixed inset-0 z-30 w-full h-full bg-black bg-opacity-30"
//         onClick={() => setGroupManagingFormOpen(false)}
//       />

//       {isLoading && <LoadingSpinner />}
//       <ErrorModal
//         isOpen={isErrorModalOpen}
//         onClose={() => setIsErrorModalOpen(false)}
//         content={errorMessage}
//       />

//       {/* 모달 컨테이너 // overflow-y-auto 위아래 스크롤(Scroll)*/}
//       <div className="absolute z-50 inline-block w-10/12 max-w-lg p-2 mx-auto overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl max-h-96 top-1/3 left-1/2 ">
//         <CloseButton onClose={onClose} />
//         <InputModal
//           isOpen={isInputModalOpen}
//           onConfirm={(inputValue) => {
//             if (selectedCurrentGroup === "createGroup") {
//               createGroup(inputValue);
//             } else {
//               updateGroup(selectedCurrentGroup, inputValue);
//             }
//           }}
//           setClose={() => setInputModalOpen(false)}
//           title={`${selectedInputType}`}
//           content=""
//           inputTextType={selectedInputType}
//           placeHolder={InputPlaceHolder}
//           hintList={["안방", "거실", "아기방"]}
//           setPasswordCheck={false}
//         />

//         <div className="flex flex-col py-1">
//           <h2 className="px-2 mb-4 text-lg font-bold text-center text-black">
//             - 그룹 관리 -
//           </h2>

//           <div className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800">
//             <div className="flex flex-col">
//               {(userInfo.deviceGroupList || []).map((deviceGroup, index) => (
//                 <span key={index} className="flex-wrap text-sm text-black">
//                   {index + 1} : {deviceGroup}
//                 </span>
//               ))}
//             </div>
//             <button
//               className="text-black bg-orange-300 hover:bg-orange-400"
//               onClick={() => {
//                 setselectedCurrentGroup("createGroup");
//                 setselectedInputType("createGroup");
//                 setInputPlaceHolder("ex) 안방, 거실, 아기방 ... ");
//                 setInputModalOpen(true);
//               }}
//             >
//               새로운 그룹 추가
//             </button>
//           </div>

//           {(userInfo.deviceGroupList || []).map((deviceGroup, index) => (
//             <div
//               key={index} // key를 최상위 요소인 <div>에 추가
//               className="flex items-center justify-between p-1 mb-4 bg-white border border-gray-800"
//             >
//               <span className="flex-wrap text-sm text-black">
//                 {index + 1}. {deviceGroup}
//               </span>
//               <button
//                 className="text-black bg-orange-300 hover:bg-orange-400"
//                 onClick={() => {
//                   console.log(`deviceGroup : ${deviceGroup}`);
//                   setselectedCurrentGroup(deviceGroup);
//                   setselectedInputType("updateGroup");
//                   setInputPlaceHolder(deviceGroup);
//                   setInputModalOpen(true);
//                 }}
//               >
//                 해당 그룹 변경
//               </button>
//             </div>
//           ))}
//         </div>
//         {/* 스크롤 힌트 */}
//         {/* <div className="sticky text-lg font-bold text-center text-red-600 transform -translate-x-1/2 bottom-2 left-1/2 animate-bounce"> */}
//         <div className="sticky bottom-0 text-lg font-bold text-center text-gray-500 transform -translate-x-1/2 left-1/2 animate-bounce">
//           ↓
//         </div>
//       </div>
//     </>
//   );
// };

// GroupManagingForm.propTypes = {
//   setGroupManagingFormOpen: PropTypes.func.isRequired,
// };

// export default GroupManagingForm;
