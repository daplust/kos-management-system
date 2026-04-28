import { Navbar } from "./Navbar"
import { Dashboard } from "../pages/Dashboard";
import { Inventaris } from "../pages/Inventaris";
import { LaporanLabaRugi } from "../pages/LaporanLabaRugi";
import { BiayaOperasional } from "../pages/BiayaOperasional";
import { RiwayatPembayaran } from "../pages/RiwayatPembayaran";
import { Invoice } from "../pages/Invoice";
import { ManajemenKamar } from "../pages/ManajemenKamar";
import { useState } from "react";

export const Layout = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
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
    return (
        <>
        <div className="flex min-h-screen bg-muted/30">
            <Navbar activeMenu={activeMenu} onMenuClick={setActiveMenu}/>
            <div className='container mx-auto px-3 py-3 overflow-y-auto ml-5'>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
        </>
    )
}