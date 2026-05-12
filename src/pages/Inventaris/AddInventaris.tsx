import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "../../supabase";
import type { Item, Room } from "../../components/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";

const AddInventory = async (item: Item) => {
    const { data, error } = await supabase.from('inventory').insert(item);
    if (error) {
        console.error('Error adding item:', error.message);
        throw new Error(error.message);
    }
    return data ;
};

export const AddInventaris = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [dialogMessage, setDialogMessage] = useState('');
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: (newItem: Item) => AddInventory(newItem),
        onSuccess: () => {
            console.log("inventory added successfully");
            setDialogType('success');
            setDialogMessage('Inventaris berhasil ditambahkan');
            setShowDialog(true);
        },
        onError: (error: Error) => {
            setDialogType('error');
            setDialogMessage(`Error: ${error.message}`);
            setShowDialog(true);
        }
    });
    const [itemData, setItemData] = useState({
        name: '',
        category: '',
        quantity: 0,
        location: '',
        condition: '',
        purchaseDate: new Date(),
        price: 0
    });
    console.log("itemData after", itemData);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === "purchaseDate") {
            setItemData({ ...itemData, [name]: new Date(value) });
        } else {
            setItemData({ ...itemData, [name]: value });
        }
        console.log(itemData);
    }
    const handleAddInventory = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("add inventory");
        e.preventDefault();
        mutate(itemData as Item);
    }
    
    const handleDialogClose = () => {
        setShowDialog(false);
        if (dialogType === 'success') {
            navigate('/inventaris');
        }
    }

        
    return (
        <div>
           <div className="mb-8 flex flex-col items-start justify-between gap-4">
              <div>
                  <h1 className="text-3xl font-semibold mb-2">Tambah Inventaris </h1>
                  <p className="text-muted-foreground text-lg">Isi data inventaris baru</p>
              </div>
          </div>
            <div className="bg-white p-8 md:p-10">
                  <form action="POST" id='addInventoryForm' onSubmit={handleAddInventory}>
                      <div className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="name" className="text-base font-semibold block mb-3">Nama Barang</label>
                            <input type="text" id="name" name="name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                          <div>
                              <label htmlFor="category" className="text-base font-semibold block mb-3">Kategori</label>
                              <select id="category" name="category" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" >
                                  <option value="" disabled selected hidden>Pilih kategori</option>
                                  <option value="Elektronik">Elektronik</option>
                                  <option value="Furniture">Furniture</option>
                                  <option value="Alat Kebersihan">Alat Kebersihan</option>
                              </select>
                          </div>
                        <div>
                            <label htmlFor="quantity" className="text-base font-semibold block mb-3">Jumlah</label>
                            <input type="text" id="quantity" name="quantity" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                          <div>
                              <label htmlFor="location" className="text-base font-semibold block mb-3">Lokasi</label>
                              <input type="text" id="location" name="location" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                            <label htmlFor="condition" className="text-base font-semibold block mb-3">Kondisi</label>
                            <select id="condition" name="condition" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" >
                                <option value="" disabled selected hidden>Pilih kondisi</option>
                                <option value="Baik">Baik</option>
                                <option value="Rusak">Rusak</option>
                                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                            </select>
                          </div>
                          <div>
                              <label htmlFor="price" className="text-base font-semibold block mb-3">Harga</label>
                              <input type="text" id="price" name="price" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                                <label htmlFor="purchaseDate" className="text-base font-semibold block mb-3">Tanggal Pembelian</label>
                                <input type="date" id="purchaseDate" name="purchaseDate" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                      </div>
                      <button
                          type="submit"
                          className="mt-8 w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                          form='addInventoryForm'
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