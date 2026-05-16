export interface Room {
  id: number;
  room_number: string;
  floor: number;
  status: 'terisi' | 'kosong' | 'maintenance';
  tenant: string | null;
  price: number;
  phone: string | null;
  payment_status: 'lunas' | 'belum bayar' | 'jatuh tempo';
  last_payment_date: Date | null;
  due_date: Date | null;
}

export interface Item {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
  condition: 'baik' | 'rusak' | 'perlu perbaikan';
  purchase_date: Date;
  price: number;
}

export interface Payment {
  id: number;
  date: Date;
  tenant: string;
  room: string;
  amount: number;
  method: 'transfer' | 'tunai';
  invoice_number: string;
  note: string;
}