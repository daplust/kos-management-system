import { Navbar } from "./Navbar"
import { useState } from "react";
import Header from "./Header";
import { LogOut, XIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogClose, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();
    const [showDialog, setShowDialog] = useState(false);
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
  const handleLogoutDialog = () => {
    setShowDialog(true);
  };
  const handleLogout = async () => {
    console.log("Logout clicked");
      const result = await signOut();

      if (result.success) {
        console.log("Logout successful");
        navigate('/signin');
      } else {
        console.error("Logout failed:", result.error);
        alert("Logout failed. Please try again.");
        return;
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
                        onClick={handleLogoutDialog}
                        className="p-2 hover:bg-muted rounded-lg transition-colors outline-3 outline-primary hover:outline-3 hover:outline-red-700"
                        aria-label="Logout"
                    >
                        <LogOut className="w-5 h-5 text-red-800" strokeWidth={2.5} />
                    </button>
            </div>
            <Header onMenuClick={toggleSidebar} onLogout={handleLogoutDialog} />
            <div className='container flex-1 mx-auto px-5 py-5 lg:px-10 lg:py-10 max-w-full'>
                    <Outlet />
            </div>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogClose className="absolute top-4 right-4 rounded-lg p-2 hover:bg-muted transition-colors" onClick={() => setShowDialog(false)}>
                </DialogClose>
                <DialogTitle className="text-lg font-semibold">Konfirmasi Logout</DialogTitle>
              </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-xl font-semibold">Anda yakin ingin keluar?</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Ya
                        </button>
                        <button
                            onClick={() => setShowDialog(false)}
                            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Tidak
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}