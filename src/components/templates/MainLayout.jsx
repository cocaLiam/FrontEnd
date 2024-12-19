// components/templates/MainLayout.jsx
import { Outlet } from 'react-router-dom'; // children 대신 Outlet 사용
import { useState } from 'react';
import BottomNavigation from '../organisms/BottomNavigation';
import SideDrawer from '../organisms/SideDrawer';

const MainLayout = ( ) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <div className="min-h-screen pb-16">
      <SideDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      <main className="p-4">
        <Outlet /> {/* children 대신 Outlet 사용 */}
      </main>
      <BottomNavigation onDrawerOpen={handleDrawerOpen} />
    </div>
  );
};

export default MainLayout