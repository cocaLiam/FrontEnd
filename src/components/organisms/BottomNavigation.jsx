// components/organisms/BottomNavigation.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import ErrorModal from "@/components/molecules/ErrorModal";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import InputModal from "@/components/molecules/InputModal";

import MenuIcon from "@/components/atoms/icons/MenuIcon";
import HomeIcon from "@/components/atoms/icons/HomeIcon";
import RoutineIcon from "@/components/atoms/icons/RoutineIcon";
import MyIcon from "@/components/atoms/icons/MyIcon";
import DebugIcon from "@/components/atoms/icons/DebugIcon";

import { andInterface } from "@/utils/android/androidInterFace";

const BottomNavigation = ({ onDrawerOpen }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInputModalOpen, setInputModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log("확인 버튼 클릭됨");
    setIsConfirmModalOpen(false);
  };

  useEffect(() => {
    // // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.resConnect = andInterface.resConnect;
    window.resRemoveParing = andInterface.resRemoveParing;
    window.resParingInfo = andInterface.resParingInfo;
    window.resConnectedDevices = andInterface.resConnectedDevices;
    window.resReadData = andInterface.resReadData;
    window.subObserveData = andInterface.subObserveData;
  }, []);

  return (
    // <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-t">
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between w-full h-16 px-4 bg-white border-t">
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content="에러 모달 테스트"
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title="작업 확인"
        content="정말 이 작업을 진행하시겠습니까?"
      />
      <InputModal
        isOpen={isInputModalOpen}
        onConfirm={() => setInputModalOpen(false)}s
        setClose={() => setInputModalOpen(false)}
        title="TTTTTT"
        content="CCCCCCCCCCCCCCC"
        inputTextType="userEmail"
        placeHolder="qqq@qqq.com"
        hintList={[]}
      />

      <ButtonWithIcon icon={MenuIcon} onClick={onDrawerOpen} />

      {/* <ButtonWithIcon icon={DebugIcon} onClick={() => setIsConfirmModalOpen(true)}/> */}
      <ButtonWithIcon icon={DebugIcon} onClick={() => setIsErrorModalOpen(true)}/>
      {/* <ButtonWithIcon icon={DebugIcon} onClick={() => {
        // andInterface.reqConnect()

        andInterface.reqParingInfo();
        // andInterface.reqRemoveParing("9C:95:6E:40:0F:75", "ccb_v1");
        andInterface.reqConnectedDevices();
        
      }}/> */}
      {/* <ButtonWithIcon icon={DebugIcon} onClick={() => setInputModalOpen(true)}/> */}

      <Link to="/" className="p-2">
        <HomeIcon />
      </Link>
      <Link to="/Routine" className="p-2">
        <RoutineIcon />
      </Link>
      <Link to="/My" className="p-2">
        <MyIcon />
      </Link>
    </nav>
  );
};

BottomNavigation.propTypes = {
  onDrawerOpen: PropTypes.func.isRequired,
};

export default BottomNavigation;
