import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'flowbite';  // flowbite-react가 아닌 flowbite를 import
import { AuthProvider } from './context/AuthProvider.jsx';

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

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App/>
    </AuthProvider>
)

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//       <App/>
//     </AuthProvider>
//   </StrictMode>
// )

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App/>
//   </StrictMode>,
// )


/**
 * 'flowbite-react' 에서 제공하는 컴포넌트 객체들
export * from "./components/Accordion";
export * from "./components/Alert";
export * from "./components/Avatar";
export * from "./components/Badge";
export * from "./components/Banner";
export * from "./components/Blockquote";
export * from "./components/Breadcrumb";
export * from "./components/Button";
export * from "./components/Card";
export * from "./components/Carousel";
export * from "./components/Checkbox";
export * from "./components/Clipboard";
export * from "./components/DarkThemeToggle";
export * from "./components/Datepicker";
export * from "./components/Drawer";
export * from "./components/Dropdown";
export * from "./components/FileInput";
export * from "./components/FloatingLabel";
export * from "./components/Flowbite";
export * from "./components/Footer";
export * from "./components/HelperText";
export * from "./components/HR";
export * from "./components/Kbd";
export * from "./components/Label";
export * from "./components/List";
export * from "./components/ListGroup";
export * from "./components/MegaMenu";
export * from "./components/Modal";
export * from "./components/Navbar";
export * from "./components/Pagination";
export * from "./components/Popover";
export * from "./components/Progress";
export * from "./components/Radio";
export * from "./components/RangeSlider";
export * from "./components/Rating";
export * from "./components/Select";
export * from "./components/Sidebar";
export * from "./components/Spinner";
export * from "./components/Table";
export * from "./components/Tabs";
export * from "./components/TextInput";
export * from "./components/Textarea";
export * from "./components/ThemeModeScript";
export * from "./components/Timeline";
export * from "./components/Toast";
export * from "./components/ToggleSwitch";
export * from "./components/Tooltip";
export * from "./hooks/use-theme-mode";
export * from "./theme";
export { createTheme } from "./helpers/create-theme";
export { getTheme, getThemeMode } from "./theme-store";

 */