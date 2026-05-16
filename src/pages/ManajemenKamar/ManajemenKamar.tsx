import { useState } from "react";
import { supabase } from "../../supabase";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Clock, DoorClosed, DoorOpen, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Room } from "../../components/types";
import { useNavigate } from "react-router";
import { PaymentModal } from "../../components/PaymentModal";


const getRooms = async (): Promise<Room[]> => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) {
        console.error('Error fetching rooms:', error.message);
        throw new Error(error.message);
    }

    return data as Room[];
}

export const ManajemenKamar = () => {
    const { user, loading } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'lunas' | 'belum bayar' | 'jatuh tempo'>('all');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const navigate = useNavigate();

    console.log(user);
    const { data, error } = useQuery<Room[], Error>({
        queryKey: ['rooms'],
        queryFn: getRooms,
        enabled: !!user
    });
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const openPaymentModal = (room: Room) => {
      console.log("open payment modal for room", room);
    setSelectedRoom(room);
    setShowPaymentModal(true);
  };

  const handleMarkAsPaid = (paymentData: { method: 'transfer' | 'tunai', note: string, date: string }) => {

  };
    const filteredRooms = data?.filter(room => {
    const matchesSearch = !searchTerm || 
      room.room_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.tenant && room.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    const matchesPayment = paymentFilter === 'all' || room.payment_status === paymentFilter;
    return matchesSearch && matchesFloor && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'terisi': return 'bg-green-100 text-green-700 border-green-200';
      case 'kosong': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'terisi': return 'Terisi';
      case 'kosong': return 'Kosong';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'lunas': return 'bg-green-100 text-green-700 border-green-300';
      case 'belum bayar': return 'bg-red-100 text-red-700 border-red-300';
      case 'jatuh tempo': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'lunas': return <CheckCircle className="w-4 h-4" />;
      case 'belum bayar': return <AlertCircle className="w-4 h-4" />;
      case 'jatuh tempo': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'lunas': return 'Lunas';
      case 'belum bayar': return 'Belum Bayar';
      case 'jatuh tempo': return 'Jatuh Tempo';
      default: return status;
    }
  };

  const unpaidCount = data?.filter(r => r.payment_status !== 'lunas' && r.status === 'terisi').length;
  const paidCount = data?.filter(r => r.payment_status === 'lunas' && r.status === 'terisi').length;
  const handleEdit = (room_number: string) => {
    navigate(`/kamar/edit/${room_number}`);
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Manajemen Kamar</h1>
          <p className="text-muted-foreground text-lg">Kelola data kamar dan penghuni</p>
        </div>
        <button
          onClick={() => navigate('/kamar/add')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base">Tambah Kamar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-border rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sudah Bayar</p>
              <p className="text-2xl font-bold text-green-600">{paidCount} Kamar</p>
            </div>
          </div>
        </div>
        <div className="bg-white border-2 border-border rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Belum Bayar</p>
              <p className="text-2xl font-bold text-red-600">{unpaidCount} Kamar</p>
            </div>
          </div>
        </div>
        <div className="bg-white border-2 border-border rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DoorOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Kamar Terisi</p>
              <p className="text-2xl font-bold text-blue-600">{data?.filter(r => r.status === 'terisi').length} Kamar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nomor kamar atau nama penghuni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-base bg-background"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
                selectedFloor === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Semua Lantai
            </button>
            <button
              onClick={() => setSelectedFloor(1)}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
                selectedFloor === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Lantai 1
            </button>
            <button
              onClick={() => setSelectedFloor(2)}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
                selectedFloor === 2
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Lantai 2
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-semibold text-muted-foreground self-center mr-2">Status Bayar:</span>
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setPaymentFilter('lunas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'lunas'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Lunas
              </button>
              <button
                onClick={() => setPaymentFilter('belum bayar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'belum bayar'
                    ? 'bg-red-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Belum Bayar
              </button>
              <button
                onClick={() => setPaymentFilter('jatuh tempo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'jatuh tempo'
                    ? 'bg-orange-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Jatuh Tempo
              </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms?.map((room) => (
          <div key={room.id} className="bg-white border-2 border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {room.status === 'terisi' ? (
                  <DoorClosed className="w-8 h-8 text-green-500" />
                ) : (
                  <DoorOpen className="w-8 h-8 text-yellow-500" />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{room.room_number}</h3>
                  <p className="text-sm text-muted-foreground">Lantai {room.floor}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(room.status)}`}>
                {getStatusLabel(room.status)}
              </span>
            </div>
            
            {room.status === 'terisi' && (
              <div className="mb-4">
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 ${getPaymentStatusColor(room.payment_status)}`}>
                  {getPaymentStatusIcon(room.payment_status)}
                  <span className="font-semibold text-sm flex-1">{getPaymentStatusLabel(room.payment_status)}</span>
                </div>
                {room.last_payment_date && (
                  <p className="text-xs text-muted-foreground mt-2">Bayar terakhir: {room.last_payment_date.toLocaleDateString('id-ID')}</p>
                )}
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Penghuni</p>
                <p className="text-base font-medium">{room.tenant || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Telepon</p>
                <p className="text-base font-medium">{room.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Harga Sewa</p>
                <p className="text-lg font-semibold text-green-600">Rp {room.price.toLocaleString('id-ID')}</p>
              </div>
            </div>

             {room.status === 'terisi' && room.payment_status !== 'lunas' && (
              <button
                onClick={() => openPaymentModal(room)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-3 font-semibold"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Tandai Sudah Bayar</span>
              </button>
            )}

            <div className="flex gap-2 pt-4 border-t border-border">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" onClick={() => handleEdit(room.room_number)}>
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedRoom(null);
          }}
          roomNumber={selectedRoom.room_number}
          tenantName={selectedRoom.tenant || ''}
          amount={selectedRoom.price}
          onSubmit={handleMarkAsPaid}
        />
      )}
    </div>
  );
}