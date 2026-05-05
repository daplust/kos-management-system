import { LayoutDashboard, DoorOpen, FileText, History, Wallet, TrendingUp, Package, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';


interface SidebarProps {
  activeMenu: string;
  isOpen: boolean;
  onClose: () => void;
} 
export const Navbar = ({ activeMenu, isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'kamar', label: 'Manajemen Kamar', icon: DoorOpen, path: '/kamar' },
    { id: 'invoice', label: 'Invoicing', icon: FileText, path: '/invoice' },
    { id: 'pembayaran', label: 'Riwayat Pembayaran', icon: History, path: '/pembayaran' },
    { id: 'operasional', label: 'Biaya Operasional', icon: Wallet, path: '/operasional' },
    { id: 'labarugi', label: 'Laporan Laba Rugi', icon: TrendingUp, path: '/labarugi' },
    { id: 'inventaris', label: 'Inventaris', icon: Package, path: '/inventaris' },
  ];

  const { user } = useAuth();

  const displayName =  user?.email || 'Admin';

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <>
    {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    <aside className={`fixed z-50 lg:sticky w-64 bg-white border-r border-border h-screen top-0 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
            <h1 className="text-xl font-semibold text-primary">Wisma Videra</h1>
            <p className="text-sm text-muted-foreground mt-1">Management System</p>
        </div>
        <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-base">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-muted-foreground mt-0.5">{displayName}</p>
        </div>
      </div>
    </aside>
    </>
  );
    // const [navbarOpen, setNavbarOpen] = useState(false);
    // return (
    //     <nav className="fixed top-0 w-full z-10 bg-sky-900 backdrop-blur-lg border-b border-blue/10 shadow-lg">
    //         <div className="max-w-5xl mx-auto px-3">
    //             <div className="flex items-center justify-between gap-8 h-16">
    //                 <Link to="/" className="text-xl font-bold text-gray-200 ">
    //                     Wisma Videra
    //                 </Link>
    //                  <div className="hidden md:flex items-center space-x-10 ">
    //                     <Link to="/dashboard" className="text-yellow-200 hover:text-gray-300 transition-colors duration-400">Dashboard</Link>
    //                     <Link to="/manajemen-kamar" className="text-yellow-200 hover:text-gray-300 transition-colors duration-400">Manajemen Kamar</Link>
    //                     <Link to="/manajemen-penghuni" className="text-yellow-200 hover:text-gray-300 transition-colors duration-400">Manajemen Penghuni</Link>
    //                     <Link to="/manajemen-pembayaran" className="text-yellow-200 hover:text-gray-300 transition-colors duration-400">Manajemen Pembayaran</Link>
    //                  </div>

    //                  <div className="navbar-button md:hidden">
    //                     {" "}
    //                     <button onClick={() => setNavbarOpen((prev) => !prev)} aria-label="toggle menu">
    //                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                         {/* <path d="M4 18L20 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
    //                         <path d="M4 12L20 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
    //                         <path d="M4 6L20 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/> */}
                            
    //                     {navbarOpen ? (
    //                         <path d="M6 18 L18 6 M6 6 L18 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
    //                     ):
    //                     (
    //                         <path d="M4 18 L20 18 M4 12 H16 20 M4 6 H20 " stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
    //                     )}
    //                     </svg>
    //                     </button>
    //                  </div>
    //             </div>
    //         </div>
    //         {/* SignIn  */}
    //         <div>
    //                     <button className="px-4 py-2 bg-yellow-200 text-sky-900 rounded-md hover:bg-yellow-300 transition-colors duration-300">
    //                         <Link to="/signin">Sign In</Link>
    //                     </button>
    //         </div>

    //                  {navbarOpen && (
    //                     <div className="md:hidden bg-sky-900">
    //                         <div className="px-2 pt-2 pb-3 space-y-1">
    //                             <Link to="/dashboard" className="block px-3 py-3 text-base font-medium text-yellow-200 hover:text-gray-500 hover:bg-sky-200">Dashboard</Link>
    //                             <Link to="/manajemen-kamar"className="block px-3 py-3 text-base font-medium text-yellow-200 hover:text-gray-500 hover:bg-sky-200">Manajemen Kamar</Link>
    //                             <Link to="/manajemen-penghuni" className="block px-3 py-3 text-base font-medium text-yellow-200 hover:text-gray-500 hover:bg-sky-200">Manajemen Penghuni</Link>
    //                             <Link to="/manajemen-pembayaran" className="block px-3 py-3 text-base font-medium text-yellow-200 hover:text-gray-500 hover:bg-sky-200">Manajemen Pembayaran</Link>
    //                         </div>
    //                     </div>
    //                  )}
    //     </nav>
    // );
}