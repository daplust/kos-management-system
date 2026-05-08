import { Route, Routes } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';
import { Layout } from './components/Layout';
import { ManajemenKamar } from './pages/ManajemenKamar/ManajemenKamar';
import { Invoice } from './pages/Invoice';
import { RiwayatPembayaran } from './pages/RiwayatPembayaran';
import { BiayaOperasional } from './pages/BiayaOperasional';
import { LaporanLabaRugi } from './pages/LaporanLabaRugi';
import { Inventaris } from './pages/Inventaris';
import { EditKamar } from './pages/ManajemenKamar/EditKamar';
import { AddKamar } from './pages/ManajemenKamar/AddKamar';


function App() {
  return (
    <div className="flex min-h-screen bg-muted/30 transtition-opacity duration-500">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kamar" element={<ManajemenKamar />} />
              <Route path="/kamar/add" element={<AddKamar />} />
              <Route path="/kamar/edit/:id" element={<EditKamar />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/pembayaran" element={<RiwayatPembayaran />} />
              <Route path="/operasional" element={<BiayaOperasional />} />
              <Route path="/labarugi" element={<LaporanLabaRugi />} />
              <Route path="/inventaris" element={<Inventaris />} />
            </Route>
          </Routes>
    </div>
  );
}

export default App;