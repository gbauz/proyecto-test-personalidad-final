import Header from './Header';
import SideBar from './SideBar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ✅ visible por defecto

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-white text-white">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <SideBar isOpen={isSidebarOpen} />
        <main
          className={`flex-1 p-6 bg-white transition-all duration-300
          }`}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
