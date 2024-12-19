// components/templates/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNavigation from "../organisms/BottomNavigation";
import SideBar from "../organisms/SideDrawer";
import { useLoading } from '../../context/LoadingContext';

const MainLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  
  // eslint-disable-next-line no-unused-vars
  const { setIsLoading } = useLoading();

  // 사이드바 함수
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  // 로딩 스피너 확인용 코드
  // const handleDrawerOpen = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setIsDrawerOpen(true);
  //   }, 1000);
  // };
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <div className="min-h-screen pb-16">

      <SideBar isOpen={isDrawerOpen} onClose={handleDrawerClose} />

      <main className="p-4">
        <Outlet /> {/* children 대신 Outlet 사용 */}
      </main>

      <BottomNavigation onDrawerOpen={handleDrawerOpen} />
    </div>
  );
};

export default MainLayout;

