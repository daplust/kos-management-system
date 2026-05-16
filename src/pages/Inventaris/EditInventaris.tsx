import { useNavigate, useParams } from 'react-router';
import { supabase } from '../../supabase';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Item } from '../../components/types';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

const getOneItem = async (id: number): Promise<Item> => {
    console.log("fetching item", id);
    const { data, error } = await supabase.from('inventory').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching item:', error.message);
        throw new Error(error.message);
    }
    
    return data as Item;
}

const updateItem = async (id: number, name: string, category: string, quantity: number, location: string, condition: string, purchaseDate: Date, price: number) => {
    console.log("update item", { id, name, category, quantity, location, condition, purchaseDate, price });
    const { data, error } = await supabase.from('inventory').update({ name, category, quantity, location, condition, purchaseDate, price }).eq('id', id);
    if (error) {
            console.error('Error updating item:', error.message);
            throw new Error(error.message);
        }
    return data;
}


export const EditItem = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [dialogMessage, setDialogMessage] = useState('');
    const { data, isLoading, error } = useQuery<Item, Error>({
        queryKey: ['inventory', id],
        queryFn: () => getOneItem(Number(id)),
    });

    useEffect(() => {
        if (data) {
            setItemData({
                name: data.name,
                category: data.category,
                quantity: data.quantity,
                location: data.location,
                condition: data.condition,
                purchase_date: data.purchase_date ? new Date(data.purchase_date) : new Date(),
                price: data.price
            });
        }
    }, [data]);

    const [itemData, setItemData] = useState({
        name: data?.name ?? '',
        category: data?.category ?? '',
        quantity: data?.quantity ?? 0,
        location: data?.location ?? '',
        condition: data?.condition ?? '',
        purchase_date: data?.purchase_date ? new Date(data.purchase_date) : new Date(),
        price: data?.price ?? 0
    });
    console.log("itemData after", itemData);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setItemData({ ...itemData, [event.target.name]: event.target.value });
        console.log(itemData);
    }
    
    const mutationItem = useMutation({
        mutationFn: () => updateItem(Number(id), itemData.name, itemData.category, Number(itemData.quantity), itemData.location, itemData.condition, new Date(itemData.purchase_date), Number(itemData.price)),
        onSuccess: () => {
            setDialogType('success');
            setDialogMessage('Item berhasil diperbarui');
            setShowDialog(true);
        },
        onError: (error: Error) => {
            setDialogType('error');
            setDialogMessage(error.message);
            setShowDialog(true);
        }
    });
    
    const handleUpdateItem = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("update item");
        e.preventDefault();
        mutationItem.mutate();
    }
    
    const handleDialogClose = () => {
        setShowDialog(false);
        if (dialogType === 'success') {
            navigate('/inventaris');
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
                  <h1 className="text-3xl font-semibold mb-2">Edit Item {itemData.name} </h1>
                  <p className="text-muted-foreground text-lg">Ubah data item</p>
              </div>
          </div>
            <div className="bg-white p-8 md:p-10">
                  <form action="PUT" id='editInventarisForm' onSubmit={handleUpdateItem}>
                      <div className="flex flex-col gap-6">
                          <div>
                              <label htmlFor="name" className="text-base font-semibold block mb-3">Nama Barang</label>
                              <input type="text" id="name" name="name" value={itemData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="category" className="text-base font-semibold block mb-3">Kategori</label>
                              <select id="category" name="category" value={itemData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" >
                                  <option value="elektronik">Elektronik</option>
                                  <option value="furniture">Furniture</option>
                                  <option value="alat_kebersihan">Alat Kebersihan</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="quantity" className="text-base font-semibold block mb-3">Jumlah</label>
                              <input type="text" id="quantity" name="quantity" value={itemData.quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="location" className="text-base font-semibold block mb-3">Lokasi</label>
                              <input type="text" id="location" name="location" value={itemData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="condition" className="text-base font-semibold block mb-3">Kondisi</label>
                              <select id="condition" name="condition" value={itemData.condition} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" >
                                <option value="baik">Baik</option>
                                <option value="rusak">Rusak</option>
                                <option value="perlu_perbaikan">Perlu Perbaikan</option>
                            </select>
                          </div>
                          <div>
                              <label htmlFor="price" className="text-base font-semibold block mb-3">Harga</label>
                              <input type="text" id="price" name="price" value={itemData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                              <label htmlFor="purchase_date" className="text-base font-semibold block mb-3">Tanggal Pembelian</label>
                              <input type="date" id="purchase_date" name="purchase_date" value={new Date(itemData.purchase_date).toISOString().split('T')[0]} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          </div>
                      <button
                          type="submit"
                          className="mt-8 w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                          form='editInventarisForm'
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