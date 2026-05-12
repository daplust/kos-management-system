import { useNavigate, useParams } from 'react-router';
import { supabase } from '../../supabase';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Room } from '../../components/types';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

const getOneRoom = async (room_number: string): Promise<Room> => {
    console.log("fetching room", room_number);
    const { data, error } = await supabase.from('rooms').select('*').eq('room_number', room_number).single();
    if (error) {
        console.error('Error fetching room:', error.message);
        throw new Error(error.message);
    }
    
    return data as Room;
}

const updateRoom = async (room_number: string, status: string, price: number, tenant: string, phone: string) => {
    console.log("update room", { room_number, status, price, tenant, phone });
    const { data, error } = await supabase.from('rooms').update({ status, price, tenant, phone }).eq('room_number', room_number);
    if (error) {
            console.error('Error updating room:', error.message);
            throw new Error(error.message);
        }
    return data;
}


export const EditKamar = () => {
    const { room_number } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [dialogMessage, setDialogMessage] = useState('');
    const { data, isLoading, error } = useQuery<Room, Error>({
        queryKey: ['room', room_number],
        queryFn: () => getOneRoom(room_number!),
    });

    console.log("room number from params", room_number);
    useEffect(() => {
        if (data) {
            setRoomData({
                status: data.status,
                price: data.price,
                tenant: data.tenant?? '-',
                phone: data.phone?? '-'
            });
        }
    }, [data]);

    const [roomData, setRoomData] = useState({
        status: data?.status ?? 'kosong',
        price: data?.price ?? 0,
        tenant: data?.tenant ?? '-',
        phone: data?.phone ?? '-'
    });
    console.log("roomData after", roomData);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRoomData({ ...roomData, [event.target.name]: event.target.value });
        console.log(roomData);
    }
    
    const mutationRoom = useMutation({
        mutationFn: () => updateRoom(room_number!, roomData.status, Number(roomData.price), roomData.tenant, roomData.phone),
        onSuccess: () => {
            setDialogType('success');
            setDialogMessage('Kamar berhasil diperbarui');
            setShowDialog(true);
        },
        onError: (error: Error) => {
            setDialogType('error');
            setDialogMessage(error.message);
            setShowDialog(true);
        }
    });
    
    const handleUpdateRoom = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("update room");
        e.preventDefault();
        mutationRoom.mutate();
    }
    
    const handleDialogClose = () => {
        setShowDialog(false);
        if (dialogType === 'success') {
            navigate('/kamar');
        }
    }
    if (authLoading || isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
  return (
      <div>
           <div className="mb-8 flex flex-col items-start justify-between gap-4">
              <div>
                  <h1 className="text-3xl font-semibold mb-2">Edit Kamar Nomor {room_number} </h1>
                  <p className="text-muted-foreground text-lg">Ubah data kamar atau penghuni</p>
              </div>
          </div>
            <div className="bg-white p-8 md:p-10">
                  <form action="PUT" id='editRoomForm' onSubmit={handleUpdateRoom}>
                      <div className="flex flex-col gap-6">
                          <div>
                              <label htmlFor="status" className="text-base font-semibold block mb-3">Status</label>
                              <select id="status" name="status" value={roomData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                  <option value="terisi">Terisi</option>
                                  <option value="kosong">Kosong</option>
                                  <option value="maintenance">Maintenance</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="price" className="text-base font-semibold block mb-3">Harga</label>
                              <input type="text" id="price" name="price" value={roomData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="tenant" className="text-base font-semibold block mb-3">Penghuni</label>
                              <input type="text" id="tenant" name="tenant" value={roomData.tenant} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="phone" className="text-base font-semibold block mb-3">Nomor Telepon</label>
                              <input type="text" id="phone" name="phone" value={roomData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                      </div>
                      <button
                          type="submit"
                          className="mt-8 w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                          form='editRoomForm'
                      >
                          {isLoading ?
                              <Loader className="w-5 h-5 animate-spin inline-block" /> : 'Submit'}
                      </button>
                  </form>
              </div>
              <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>
                              {dialogType === 'success' ? 'Berhasil' : 'Error'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                              {dialogMessage}
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogAction onClick={handleDialogClose}>
                              OK
                          </AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>

  );
}