// components/molecules/InputModal.jsx
import { useState } from "react";

import PropTypes from "prop-types";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ErrorModal from "@/components/molecules/ErrorModal";

import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

const SelectInputType = ({ className, type="text", placeHolder="", hintList=["11","22","33"], onChange }) => {
  switch (type) {
    case "userName":
      return (
        <input
          className={className}
          type="text"
          placeholder={placeHolder || "이름을 입력하세요"}
          pattern="[a-zA-Z가-힣\s]+" // 영문, 한글, 공백만 허용
          onChange={onChange}
          required
          autoFocus
        />
      );
    case "userEmail":
      return <input className={className} type="email" placeholder={placeHolder || "example@example.com"} onChange={onChange} required autoFocus />;
    case "password":
      return <input className={className} type="password" minLength="6" maxLength="20" placeholder={placeHolder} onChange={onChange} required />;
    case "newPassword":
      return <input className={className} type="password" minLength="6" maxLength="20" placeholder={placeHolder} onChange={onChange} required />;
    case "homeAddress":
      return (
        <textarea
          className={className}
          placeholder={placeHolder || "집 주소를 입력하세요"}
          rows="3"
          onChange={onChange}
          required
          autoFocus
        />
      );
    case "phoneNumber":
      return (
        <input
          className={className}
          type="tel"
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          placeholder={placeHolder}
          onChange={onChange}
          required
          autoFocus
        />
      );
    case "date":
      return <input className={className} type="date" min="2023-01-01" max="2025-12-31" onChange={onChange} required autoFocus />;
    case "number":
      return <input className={className} type="number" min="1" max="100" onChange={onChange} required autoFocus />;
      //<input type="number" step="0.1" required autoFocus/>
    case "hinList":
      return (
        <>
          <input className={className} type="text" list="suggestions" placeholder={placeHolder} onChange={onChange} required autoFocus />
          <datalist id="suggestions">
            {hintList.map((tmp, index) => (
              <option key={index} value={tmp} />
            ))}
          </datalist>
        </>
      );
    case "text":
      return <input className={className} type="text" onChange={onChange} required/>;
    case "createGroup":
      return (
        <>
          <input className={className} type="text" list="suggestions" minLength="1" maxLength="20" placeholder={placeHolder} onChange={onChange} required autoFocus />
          <datalist id="suggestions">
            {hintList.map((tmp, index) => (
              <option key={index} value={tmp} />
            ))}
          </datalist>
        </>
      );
      case "updateGroup":
        return <input className={className} type="text" minLength="1" maxLength="20" placeholder={placeHolder} onChange={onChange} required autoFocus/>;
      case "updateDeviceInfo":
        return <input className={className} type="text" minLength="1" maxLength="20" placeholder={placeHolder} onChange={onChange} required autoFocus/>;
    default:
      // text
      return <input type="text" onChange={onChange} />;
  }
};

const InputModal = ({
  isOpen,
  onConfirm,
  setClose,
  title = "",
  content = "",
  inputTextType = "text",
  placeHolder = "",
  hintList = [],
  setPasswordCheck = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [inputValue, setInputValue] = useState(""); // 입력 값을 저장할 상태 추가
  const [passwordValue, setPasswordValue] = useState(""); // 비밀번호 입력 값 상태 추가

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 form 제출 동작 방지
    setIsLoading(true);

    try {
      // onConfirm(true);
      if(passwordValue){
        await onConfirm({[inputTextType]:inputValue, "password":passwordValue});
      }else{
        await onConfirm(inputValue);
      }
      setClose()

    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="w-full max-w-md px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
    <>
    {/* 모달 컨테이너 배경화면 (오버레이) */}
    {isOpen && (
      <div 
        className="fixed inset-0 z-30 w-full h-full bg-black bg-opacity-30" 
        onClick={setClose}
      />
    )}
      {/* 모달 컨테이너 */}
      <div className="fixed z-50 inline-block w-10/12 p-2 mx-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl top-1/3 left-1/2">
        {isLoading && <LoadingSpinner />}
        <ErrorModal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          content={errorMessage}
        />

        {title && (
          <h3 className="px-2 mb-4 text-lg font-bold text-center text-black">
            {title}
          </h3>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {content && (
              <label className="block mb-2 text-black">{content}</label>
            )}

            <SelectInputType
              className="w-full px-3 py-2 leading-tight text-black border rounded appearance-none focus:outline-none focus:shadow-outline"
              type={inputTextType}
              placeHolder={placeHolder}
              hintList={hintList}
              onChange={(e) => {setInputValue(e.target.value); 
                // console.log(`e.target.value : ${e.target.value}`)
              }} // 입력 값 상태 업데이트
              updateInputValue
            />
            {setPasswordCheck && <SelectInputType
              className="w-full px-3 py-2 leading-tight text-black border rounded appearance-none focus:outline-none focus:shadow-outline"
              type="password"
              placeHolder="최근 비밀번호"
              onChange={(e) => {setPasswordValue(e.target.value);
                // console.log(`e.target.value : ${e.target.value}`);
              }} // 비밀번호 값 상태 업데이트
            />}
            {/* <SelectInputType
              className="w-full px-3 py-2 leading-tight text-gray-500 border rounded appearance-none focus:outline-none focus:shadow-outline"
              type="email"
              placeHolder="example@naver.com"
            />
            <SelectInputType
              className="w-full px-3 py-2 leading-tight text-gray-500 border rounded appearance-none focus:outline-none focus:shadow-outline"
              type="date"
            />
            <SelectInputType
              className="w-full px-3 py-2 leading-tight text-gray-500 border rounded appearance-none focus:outline-none focus:shadow-outline"
              type="password"
              placeHolder="6글자이상"
            />
            <SelectInputType
              className="w-full px-3 py-2 leading-tight text-gray-500 border rounded appearance-none focus:outline-none focus:shadow-outline"
              type="number"
            />
            <SelectInputType
              className="w-full px-3 py-2 leading-tight text-gray-500 border rounded appearance-none focus:outline-none focus:shadow-outline"
              type="hinList"
              placeHolder="ex) 안방, 거실, 아기방 ... "
              hintList={["안방", "거실", "아기방"]}
            /> */}

          </div>

          {/* 모달 컨테이너 */}
          {/* <div className="flex flex-row justify-end gap-2"> */}
          <div className="grid grid-cols-2 gap-2 px-1 py-2">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md"
              onClick={() => setClose(true)}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              변경
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

InputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  setClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  inputTextType: PropTypes.string,
  placeHolder: PropTypes.string,
  hintList: PropTypes.array,
  setPasswordCheck: PropTypes.bool
};

export default InputModal;
