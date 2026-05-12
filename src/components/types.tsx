export interface Room {
  id: number;
  room_number: string;
  floor: number;
  status: 'terisi' | 'kosong' | 'maintenance';
  tenant: string | null;
  price: number;
  phone: string | null;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  condition: 'baik' | 'rusak' | 'perlu_perbaikan';
  purchaseDate: Date;
  price: number;
}