import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "../../supabase";
import type { Room } from "../../components/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";

const AddRoom = async (room: Room) => {
    const { data, error } = await supabase.from('rooms').insert(room);
    if (error) {
        console.error('Error adding room:', error.message);
        throw new Error(error.message);
    }
    return data ;
};

export const AddKamar = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [dialogMessage, setDialogMessage] = useState('');
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: (newRoom: Room) => AddRoom(newRoom),
        onSuccess: () => {
            console.log("room added successfully");
            setDialogType('success');
            setDialogMessage('Kamar berhasil ditambahkan');
            setShowDialog(true);
        },
        onError: (error: Error) => {
            setDialogType('error');
            setDialogMessage(`Error: ${error.message}`);
            setShowDialog(true);
        }
    });
    const [roomData, setRoomData] = useState({
        room_number: '',
        floor: 0,
        status: 'kosong',
        price: 0,
        tenant: '-',
        phone: '-',
        payment_status: 'belum bayar',
        due_date: new Date()
    });
    console.log("roomData after", roomData);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRoomData({ ...roomData, [event.target.name]: event.target.value });
        console.log(roomData);
    }
    const handleAddRoom = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("add room");
        e.preventDefault();
        mutate(roomData as Room);
    }
    
    const handleDialogClose = () => {
        setShowDialog(false);
        if (dialogType === 'success') {
            navigate('/kamar');
        }
    }

        
    return (
        <div>
           <div className="mb-8 flex flex-col items-start justify-between gap-4">
              <div>
                  <h1 className="text-3xl font-semibold mb-2">Tambah Kamar </h1>
                  <p className="text-muted-foreground text-lg">Isi data kamar baru</p>
              </div>
          </div>
            <div className="bg-white p-8 md:p-10">
                  <form action="POST" id='addRoomForm' onSubmit={handleAddRoom}>
                      <div className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="room_number" className="text-base font-semibold block mb-3">Nomor Kamar</label>
                            <input type="text" id="room_number" name="room_number" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label htmlFor="floor" className="text-base font-semibold block mb-3">Lantai</label>
                            <input type="text" id="floor" name="floor" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                          <div>
                              <label htmlFor="status" className="text-base font-semibold block mb-3">Status</label>
                              <select id="status" name="status" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" >
                                  <option value="" disabled selected hidden>Pilih status</option>
                                  <option value="terisi">Terisi</option>
                                  <option value="kosong">Kosong</option>
                                  <option value="maintenance">Maintenance</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="price" className="text-base font-semibold block mb-3">Harga</label>
                              <input type="text" id="price" name="price" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="tenant" className="text-base font-semibold block mb-3">Penghuni</label>
                              <input type="text" id="tenant" name="tenant" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="phone" className="text-base font-semibold block mb-3">Nomor Telepon</label>
                              <input type="text" id="phone" name="phone" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                                <label htmlFor="payment_status" className="text-base font-semibold block mb-3">Status Pembayaran</label>
                                <select id="payment_status" name="payment_status" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" >
                                    <option value="" disabled selected hidden>Pilih status pembayaran</option>
                                    <option value="lunas">Lunas</option>
                                    <option value="belum bayar">Belum Bayar</option>
                                    <option value="jatuh tempo">Jatuh Tempo</option>
                                </select>
                          </div>
                          <div>
                              <label htmlFor="due_date" className="text-base font-semibold block mb-3">Tanggal Jatuh Tempo</label>
                              <input type="date" id="due_date" name="due_date" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                      </div>
                      <button
                          type="submit"
                          className="mt-8 w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                          form='addRoomForm'
                      >
                          {isPending ?
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
    )
};