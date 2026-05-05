export interface Room {
  id: number;
  room_number: string;
  floor: number;
  status: 'terisi' | 'kosong' | 'maintenance';
  tenant: string | null;
  price: number;
  phone: string | null;
}