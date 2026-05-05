import { useParams } from 'react-router';
import { supabase } from '../../supabase';
import { useQuery } from '@tanstack/react-query';
import type { Room } from '../../components/types';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const getOneRoom = async (id: number): Promise<Room> => {
    const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching room:', error.message);
        throw new Error(error.message);
    }
    
    return data as Room;
}
export const EditKamar = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { data, isLoading, error } = useQuery<Room, Error>({
        queryKey: ['room', id],
        queryFn: () => getOneRoom(Number(id)),
        enabled: !!id
    });
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
                  <h1 className="text-3xl font-semibold mb-2">Edit Kamar Nomor {id} </h1>
                  <p className="text-muted-foreground text-lg">Ubah data kamar atau penghuni</p>
              </div>
          </div>
          <div className="bg-white p-8 md:p-10">
              <form action="" id='editRoomForm'>
                  <div className="flex flex-col gap-6">
                      <div>
                          <label htmlFor="status" className="text-base font-semibold block mb-3">Status</label>
                          <select id="status" name="status" defaultValue={data?.status} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                              <option value="terisi">Terisi</option>
                              <option value="kosong">Kosong</option>
                              <option value="maintenance">Maintenance</option>
                          </select>
                      </div>
                      <div>
                        <label htmlFor="price" className="text-base font-semibold block mb-3">Harga</label>
                        <input type="text" id="price" name="price" defaultValue={data?.price ?? ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                            <label htmlFor="tenant" className="text-base font-semibold block mb-3">Penghuni</label>
                            <input type="text" id="tenant" name="tenant" defaultValue={data?.tenant ?? ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                            <label htmlFor="phone" className="text-base font-semibold block mb-3">Nomor Telepon</label>
                            <input type="text" id="phone" name="phone" defaultValue={data?.phone ?? ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
      </div>

  );
}