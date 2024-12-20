// components/templates/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNavigation from "../organisms/BottomNavigation";
import SideBar from "../organisms/SideBar";
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
    <div className="fixed inset-0 w-full h-full bg-gray-700">
    {/* 전체화면 컨테이너 */}

      <SideBar isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      {/* 사이드바 컴포넌트 컨테이너 */}

      <BottomNavigation onDrawerOpen={handleDrawerOpen} />
      {/* Bottom GNB 컴포넌트 컨테이너 */}
      
      <main>
      {/* 메인 콘텐츠 영역 - 웹 접근성과 SEO를 위한 시맨틱 태그  << 의미적으로 있는 태그*/}
        
        {/* <div className="fixed w-full h-full"> */}
        <div className="fixed inset-0 w-full h-full">
        {/* Pages 들이 사용하는 컨테이너 정의 */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

