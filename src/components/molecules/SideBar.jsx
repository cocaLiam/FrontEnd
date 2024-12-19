"use client";

import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

// 사용방법:
// 1. import { SideBar } from './components/SideBar';
// 2. <SideBar /> 형태로 컴포넌트에서 호출

export default function SideBar() {
  return (
    // w-fit: 내용물 크기만큼만 너비 차지
    // h-screen: 화면 전체 높이
    // bg-gray-50: 배경색 회색계열
    <div className="w-fit h-screen bg-gray-50">
      <Sidebar aria-label="Sidebar with content separator example">
        <Sidebar.Items>
          {/* 첫번째 아이템 그룹 */}
          <Sidebar.ItemGroup>
            {/* 
              각 아이템 스타일링:
              hover:bg-gray-100: 호버시 배경색 변경
              cursor-pointer: 마우스 포인터 변경
              transition-colors: 색상 변경시 부드러운 효과
            */}
            <Sidebar.Item href="#" icon={HiChartPie} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Kanban
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiInbox} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiArrowSmRight} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTable} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Sign Up
            </Sidebar.Item>
          </Sidebar.ItemGroup>

          {/* 두번째 아이템 그룹 - 구분선으로 분리됨 */}
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Upgrade to Pro
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Documentation
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={BiBuoy} className="hover:bg-gray-100 cursor-pointer transition-colors">
              Help
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

/* 
추가 커스터마이징 옵션:

1. 사이드바 전체 스타일링:
- shadow-lg: 그림자 효과
- border-r: 오른쪽 테두리
예: <div className="w-fit h-screen bg-gray-50 shadow-lg border-r">

2. 아이템 그룹 사이 간격:
- space-y-2: 아이템 간 세로 간격
예: <Sidebar.ItemGroup className="space-y-2">

3. 다크모드 지원:
- dark:bg-gray-800: 다크모드시 배경색
- dark:text-white: 다크모드시 텍스트 색상
예: className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"

4. 활성 상태 표시:
- active:bg-gray-200: 클릭시 배경색
예: className="hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-colors"
*/
