"use client";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Sidebar } from "flowbite-react";

/* eslint-disable no-unused-vars */
import {
  HiCog, // 설정 톱니바퀴
  HiAdjustments, // 조정/설정
  HiHome, // 홈
  HiUser, // 사용자
  HiMenu, // 햄버거 메뉴
  HiSearch, // 검색
  HiPlus, // 더하기/추가
  HiX, // X/닫기
  HiTrash, // 삭제
  HiPencil, // 수정/편집
  HiOutlineHeart, // 좋아요/찜
  HiBell, // 알림
  HiArrowLeft, // 뒤로가기
  HiLogout, // 로그아웃
} from "react-icons/hi";

// 사용방법:
// 1. import { SideBar } from './components/SideBar';
// 2. <SideBar isOpen={isOpen} onClose={handleClose} /> 형태로 사용
// 3. isOpen: 사이드바 열림/닫힘 상태
// 4. onClose: 사이드바 닫기 함수

export default function SideBar({ isOpen, onClose }) {
  return (
    <>
      {/* 오버레이 - 사이드바가 열렸을 때만 표시 */}
      {isOpen && (
        <div
          // fixed: 화면에 고정, inset-0: 상하좌우 0으로 설정해 전체화면 차지
          // z-40: z-index 40으로 설정, bg-black: 검은 배경
          // bg-opacity-50: 배경 투명도 50%
          // fixed: 화면에 고정
          // inset-y-0: 화면의 위(top)와 아래(bottom)를 0으로 설정해 세로로 꽉 차게
          // left-0: 왼쪽에서 시작
          // w-1/2: 너비를 화면의 50%로 설정
          // z-40: z-index를 40으로 설정해 다른 요소들보다 위에 표시
          // bg-black: 배경색을 검정으로
          // bg-opacity-50: 배경의 투명도를 50%로 설정
          // className="fixed inset-y-0 left-0 z-40 bg-black bg-opacity-100"
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}

      {/* 사이드바 메인 */}
      {/* <div
        // fixed: 화면에 고정, top-0 left-0: 좌측 상단에 위치
        // h-screen: 화면 높이만큼, w-64: 너비 64 (256px)
        // bg-gray-50: 회색 배경
        // transform: 변형 적용
        // transition-transform: 변형에 트랜지션 효과
        // duration-300: 0.3초 동안 진행
        // ease-in-out: 부드러운 시작과 끝
        // z-50: z-index 50으로 설정
        // ${isOpen ? 'translate-x-0' : '-translate-x-full'}: 열림/닫힘 상태에 따라 위치 이동
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-50 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      > */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar aria-label="Sidebar with content separator example">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                // transition-colors: 색상 변경시 트랜지션 효과
                // cursor-pointer: 마우스 오버시 포인터 커서
                // hover:bg-gray-100: 호버시 밝은 회색 배경
                className="transition-colors cursor-pointer hover:bg-gray-950"
                as={Link} // Sidebar.Item을 Link로 변환
                to="/"
                icon={HiHome}
                onClick={onClose}
              >
                HOME
              </Sidebar.Item>

              <Sidebar.Item
                className="transition-colors cursor-pointer hover:bg-gray-950"
                as={Link} // Sidebar.Item을 Link로 변환
                to="/settings"
                icon={HiCog}
                onClick={onClose}
              >
                설정
              </Sidebar.Item>

              <Sidebar.Item
                className="transition-colors cursor-pointer hover:bg-gray-950"
                as={Link} // Sidebar.Item을 Link로 변환
                to="/profile"
                icon={HiUser}
                onClick={onClose}
              >
                개인설정
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                className="transition-colors cursor-pointer hover:bg-gray-950"
                as={Link} // Sidebar.Item을 Link로 변환
                to="/logout"
                icon={HiLogout}
                onClick={onClose}
              >
                LogOut
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
}

// PropTypes 정의
SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

/* 
사용 예시:

import { useState } from 'react';
import SideBar from './components/SideBar';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>메뉴 열기</button>
      <SideBar isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
*/












// 이전 코드 --------- 기본 양식 -----------------

// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types'; // PropTypes import 추가

// const SideDrawer = ({ isOpen, onClose }) => {
//   return (
//     <>
//       {/* 오버레이 */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-50"
//           onClick={onClose}
//         />
//       )}

//       {/* 사이드 드로어 */}
//       <div className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         <div className="flex flex-col h-full p-4">
//           <Link to="/settings" onClick={onClose} className="py-3">설정</Link>
//           <Link to="/profile" onClick={onClose} className="py-3">개인설정</Link>
//           <Link to="/debug" onClick={onClose} className="py-3">Debug</Link>
//         </div>
//       </div>
//     </>
//   );
// };

// // PropTypes 정의 추가
// SideDrawer.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired
// };

// export default SideDrawer;
