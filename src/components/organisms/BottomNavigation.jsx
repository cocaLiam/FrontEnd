// components/organisms/BottomNavigation.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MenuIcon from "../atoms/icons/MenuIcon";
import HomeIcon from "../atoms/icons/HomeIcon";
import RoutineIcon from "../atoms/icons/RoutineIcon";
import MyIcon from "../atoms/icons/MyIcon";

import { TextModal } from "../molecules/Modal";
import { ConfirmModal } from "../molecules/Modal";

const BottomNavigation = ({ onDrawerOpen }) => {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleConfirm = () => {
    // 확인 버튼 클릭 시 실행할 로직
    console.log("확인 버튼 클릭됨");
    setIsConfirmModalOpen(false);
  };

  return (
    // <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-t">
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-t">
      <button onClick={onDrawerOpen} className="p-2">
        <MenuIcon />
      </button>

      <button
        onClick={() => {
          // setIsTextModalOpen(true);
          setIsConfirmModalOpen(true);
        }}
      >
        모달 열기
      </button>

      <Link to="/" className="p-2">
        <HomeIcon />
      </Link>
      <Link to="/routine" className="p-2">
        <RoutineIcon />
      </Link>
      <Link to="/my" className="p-2">
        <MyIcon />
      </Link>

      {/* 모달 컴포넌트는 return문 안에 직접 배치 */}
      <TextModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        content="텍스트 모달 테스트"
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title="작업 확인"
        content="정말 이 작업을 진행하시겠습니까?"
      />
    </nav>
  );
};

BottomNavigation.propTypes = {
  onDrawerOpen: PropTypes.func.isRequired,
};

export default BottomNavigation;
