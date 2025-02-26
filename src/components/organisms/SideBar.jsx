import { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // PropTypes import 추가

import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";

import AddDeviceIcon from "@/components/atoms/icons/AddDeviceIcon";
import SettingsIcon from "@/components/atoms/icons/SettingsIcon";
import LoginIcon from "@/components/atoms/icons/LoginIcon";
import LogoutIcon from "@/components/atoms/icons/LogoutIcon";
import DebugIcon from "@/components/atoms/icons/DebugIcon";

import { AuthContext } from "@/context/AuthContext";


export default function SideBar({ isOpen, onClose }) {
  const authStatus = useContext(AuthContext);

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30"
          onClick={onClose}
        />
      )}

      {/* 메인 사이드바 컨테이너 */}
      <div
        className={`fixed left-0 top-0 z-50 flex flex-col bg-clip-border rounded-xl bg-gray-300 text-gray-800 h-[calc(100vh-2rem)] max-w-[15rem] p-4 shadow-xl shadow-blue-gray-900/5 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 사이드바 헤더 */}
        <div className="p-4 mb-2">
          <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-gray-900">
            Side Bar 메뉴
          </h5>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col space-y-2 min-w-[120px] p-2 font-sans text-base font-normal text-gray-700">
          {/* AddDevice 버튼 */}
          <ButtonWithIcon
            icon={AddDeviceIcon}
            content={<Link to="/AddDevice">AddDevice</Link>}
            onClick={onClose}
          />
          {/* Settings 버튼 */}
          <ButtonWithIcon
            icon={SettingsIcon}
            content={<Link to="/Settings">Settings</Link>}
            onClick={onClose}
          />
          {/* LogOut 버튼 */}
          {authStatus.isLoggedIn && (
            <ButtonWithIcon
              icon={LogoutIcon}
              content={<Link to="/">Logout</Link>}
              onClick={async ()=>{
                await authStatus.logout();
                onClose();
              }}
            />
          )}

          <div className="flex flex-col space-y-1">
            {/* 구분선 space-y-1 : Item 간의 간격을 정의 */}
            <div className="w-full h-[2px] bg-gray-950" />
            <div className="w-full h-[2px] bg-gray-950" />
          </div>

          {/* Debug 버튼 */}
          <ButtonWithIcon
            icon={DebugIcon}
            content={<Link to="/Debug">Debug</Link>}
            onClick={onClose}
          />
          <span> 인사말 </span>
        </nav>
      </div>
    </>
  );
}

// PropTypes 정의 추가
SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
