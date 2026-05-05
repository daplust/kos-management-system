import { Navbar } from "./Navbar"
import { useState } from "react";
import Header from "./Header";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router";
import { Helmet } from "react-helmet-async";

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();
    
    // Get active menu from URL path
    const getActiveMenu = () => {
        const path = location.pathname;
        if (path === '/') return 'dashboard';
        return path.substring(1); // Remove leading slash
    };
    
    const activeMenu = getActiveMenu();
    
    // Get page title
    const getPageTitle = () => {
        const titles: { [key: string]: string } = {
            'dashboard': 'Dashboard',
            'kamar': 'Manajemen Kamar',
            'invoice': 'Invoicing',
            'pembayaran': 'Riwayat Pembayaran',
            'operasional': 'Biaya Operasional',
            'labarugi': 'Laporan Laba Rugi',
            'inventaris': 'Inventaris'
        };
        return titles[activeMenu] || 'Dashboard';
    };

  const handleLogout = async () => {
    console.log("Logout clicked");
    if (window.confirm("Are you sure you want to log out?")) {
      const result = await signOut();

      if (result.success) {
        console.log("Logout successful");
        navigate('/signin');
      } else {
        console.error("Logout failed:", result.error);
        alert("Logout failed. Please try again.");
        return;
      }
    }
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };


    return (
        <>
        <Helmet>
            <title>Wisma Videra - {getPageTitle()}</title>
        </Helmet>
        <Navbar activeMenu={activeMenu} isOpen={isSidebarOpen} onClose={closeSidebar}/>
        <div className="flex-1 flex flex-col min-w-0 shrink-0 overflow-auto">
            <div className="logout-dektop top-10 right-10 absolute invisible lg:visible">
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-muted rounded-lg transition-colors outline-3 outline-primary hover:outline-3 hover:outline-red-700"
                        aria-label="Logout"
                    >
                        <LogOut className="w-5 h-5 text-red-800" strokeWidth={2.5} />
                    </button>
            </div>
            <Header onMenuClick={toggleSidebar} onLogout={handleLogout} />
            <div className='container flex-1 mx-auto px-5 py-5 lg:px-10 lg:py-10 max-w-full'>
                    <Outlet />
            </div>
        </div>
        </>
    )
}