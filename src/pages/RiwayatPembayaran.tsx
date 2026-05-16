import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import type { Payment } from '../components/types';
import { supabase } from '../supabase';
import { useQuery } from '@tanstack/react-query';


const getPayments = async (): Promise<Payment[]> => {
    const {data, error} = await supabase.from('payments').select('*');
    if (error) {
        console.error('Error fetching payments:', error);
        throw new Error(error.message);
    }
    return data as Payment[];
}
export const RiwayatPembayaran = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<'all' | 'transfer' | 'cash'>('all');
const { data: payments, error } = useQuery<Payment[], Error>({
    queryKey: ['payments'],
    queryFn: getPayments,
  });

  if (error) {
        return <div>Error: {error.message}</div>;
    }

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const getMethodBadge = (method: string) => {
    return method === 'transfer'
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-green-100 text-green-700 border-green-200';
  };

  const getMethodLabel = (method: string) => {
    return method === 'transfer' ? 'Transfer' : 'Tunai';
  };

  const totalAmount = filteredPayments?.reduce((sum, payment) => sum + payment.amount, 0) ?? 0;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Riwayat Pembayaran</h1>
        <p className="text-muted-foreground text-lg">Catatan pembayaran dari penghuni</p>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Total Pembayaran Tertampil</h3>
          <p className="text-2xl font-semibold text-green-600">Rp {totalAmount.toLocaleString('id-ID')}</p>
        </div>
        <p className="text-muted-foreground text-base">{filteredPayments?.length ?? 0} transaksi</p>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama, kamar, atau nomor invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-base bg-background"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFilterMethod('all')}
              className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${
                filterMethod === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterMethod('transfer')}
              className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${
                filterMethod === 'transfer' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Transfer
            </button>
            <button
              onClick={() => setFilterMethod('cash')}
              className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${
                filterMethod === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Tunai
            </button>
            <button className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold">Tanggal</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Nama Penghuni</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Kamar</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Jumlah</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Metode</th>
                <th className="px-6 py-4 text-left text-base font-semibold">No. Invoice</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-5 text-base">{payment.date.toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-5 text-base font-medium">{payment.tenant}</td>
                  <td className="px-6 py-5 text-base">{payment.room}</td>
                  <td className="px-6 py-5 text-base font-semibold text-green-600">
                    Rp {payment.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium border ${getMethodBadge(payment.method)}`}>
                      {getMethodLabel(payment.method)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-base">{payment.invoice_number}</td>
                  <td className="px-6 py-5 text-base text-muted-foreground">{payment.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
