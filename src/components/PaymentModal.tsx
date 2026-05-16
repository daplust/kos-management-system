import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomNumber: string;
  tenantName: string;
  amount: number;
  onSubmit: (paymentData: { method: 'transfer' | 'tunai'; note: string; date: string }) => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  roomNumber,
  tenantName,
  amount,
  onSubmit,
}: PaymentModalProps) => {
  const [method, setMethod] = useState<'transfer' | 'tunai'>('transfer');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ method, note, date });
    setNote('');
    setMethod('transfer');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Konfirmasi Pembayaran</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-base text-muted-foreground">Kamar:</span>
              <span className="text-base font-semibold">{roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base text-muted-foreground">Penghuni:</span>
              <span className="text-base font-semibold">{tenantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base text-muted-foreground">Jumlah:</span>
              <span className="text-lg font-bold text-green-600">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold mb-3">
              Tanggal Pembayaran
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border rounded-lg text-base focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold mb-3">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`px-6 py-4 rounded-lg text-base font-medium transition-all ${
                  method === 'transfer'
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Transfer
              </button>
              <button
                type="button"
                onClick={() => setMethod('tunai')}
                className={`px-6 py-4 rounded-lg text-base font-medium transition-all ${
                  method === 'tunai'
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Tunai
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold mb-3">
              Catatan (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                method === 'transfer'
                  ? 'Contoh: Transfer BCA, Transfer Mandiri'
                  : 'Contoh: Dibayar langsung ke admin'
              }
              rows={3}
              className="w-full px-4 py-3 border-2 border-border rounded-lg text-base focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-muted text-foreground rounded-lg text-base font-semibold hover:bg-muted/80 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg text-base font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Konfirmasi Bayar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
