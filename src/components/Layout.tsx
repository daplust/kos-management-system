import { Navbar } from "./Navbar"
import { Dashboard } from "../pages/Dashboard";
import { Inventaris } from "../pages/Inventaris";
import { LaporanLabaRugi } from "../pages/LaporanLabaRugi";
import { BiayaOperasional } from "../pages/BiayaOperasional";
import { RiwayatPembayaran } from "../pages/RiwayatPembayaran";
import { Invoice } from "../pages/Invoice";
import { ManajemenKamar } from "../pages/ManajemenKamar";
import { useState } from "react";
import Header from "./Header";
import { LogOut } from "lucide-react";

export const Layout = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return <Dashboard />;
            case 'kamar':
                return <ManajemenKamar />;
            case 'invoice':
                return <Invoice />;
            case 'pembayaran':
                return <RiwayatPembayaran />;
            case 'operasional':
                return <BiayaOperasional />;
            case 'labarugi':
                return <LaporanLabaRugi />;
            case 'inventaris':
                return <Inventaris />;
            default:
                return <Dashboard />;
        }
  }

  const handleLogout = () => {
    // setIsLoggedIn(false);
    setActiveMenu('dashboard');
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
    return (
        <>
        <Navbar activeMenu={activeMenu} onMenuClick={setActiveMenu} isOpen={isSidebarOpen} onClose={closeSidebar}/>
        <div className="flex-1 flex flex-col min-w-0 shrink-0">
            <div className="logout-dektop top-10 right-10 absolute invisible lg:visible">
                    <button
                        // onClick={onLogout}
                        className="p-2 hover:bg-muted rounded-lg transition-colors outline-3 outline-primary hover:outline-3 hover:outline-red-700"
                        aria-label="Logout"
                    >
                        <LogOut className="w-5 h-5 text-red-800" strokeWidth={2.5} />
                    </button>
            </div>
            <Header onMenuClick={toggleSidebar} />
            <div className='container flex-1 mx-auto px-3 py-3 overflow-y-auto ml-5'>
                    {/* <Header onMenuClick={toggleSidebar} onLogout={handleLogout} /> */}

                    {renderContent()}
            </div>
        </div>
        </>
    )
}