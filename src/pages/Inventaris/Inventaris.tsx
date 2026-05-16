import { useState } from "react";
import type { Item } from "../../components/types";
import { supabase } from "../../supabase";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Package, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";


const getItems = async (): Promise<Item[]> => {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) {
        console.error('Error fetching inventory:', error.message);
        throw new Error(error.message);
    }
    return data as Item[];
}

const deleteItem = async (id: number) => {
    const { data, error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) {
        console.error('Error deleting item:', error.message);
        throw new Error(error.message);
    }
    return data;
}

export const Inventaris = () => {
  const navigate = useNavigate();
   const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const queryClient = useQueryClient();

  const categories = ['Elektronik', 'Furniture', 'Alat Kebersihan'];

  const { data: items, error } = useQuery<Item[], Error>({
    queryKey: ['inventory'],
    queryFn: getItems,
  });

  if (error) {
        return <div>Error: {error.message}</div>;
    }
  const filteredItems = items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'baik': return 'bg-green-100 text-green-700 border-green-200';
      case 'rusak': return 'bg-red-100 text-red-700 border-red-200';
      case 'perlu perbaikan': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'baik': return 'Baik';
      case 'rusak': return 'Rusak';
      case 'perlu perbaikan': return 'Perlu Perbaikan';
      default: return condition;
    }
  };

  const totalValue = filteredItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const handleDeleteItem = (id: number) => {
      setSelectedItemId(id);
      setShowDialog(true);
      console.log("delete item", id);

  }

  const deleteItemById = useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: async () => {
      setShowDialog(false);
      setSelectedItemId(null);
      await queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
  const confirmDeleteItem = async (selectedItemId: number | null) => {
      if (selectedItemId !== null) {
          deleteItemById.mutate(selectedItemId);
      }
      setShowDialog(false);
      setSelectedItemId(null);
      
  }
  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Manajemen Inventaris</h1>
          <p className="text-muted-foreground text-lg">Kelola aset dan barang inventaris</p>
        </div>
        <button
          onClick={() => navigate('/inventaris/add')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base">Tambah Barang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-6 h-6 text-blue-500" />
            <h3 className="text-base text-muted-foreground">Total Item</h3>
          </div>
          <p className="text-3xl font-semibold">{filteredItems?.reduce((sum, item) => sum + item.quantity, 0)}</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-6 h-6 text-green-500" />
            <h3 className="text-base text-muted-foreground">Kondisi Baik</h3>
          </div>
          <p className="text-3xl font-semibold text-green-600">
            {filteredItems?.filter(i => i.condition === 'baik').reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-6 h-6 text-orange-500" />
            <h3 className="text-base text-muted-foreground">Total Nilai Aset</h3>
          </div>
          <p className="text-2xl font-semibold text-orange-600">Rp {totalValue?.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama barang atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-base bg-background"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${
                filterCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-5 py-3 rounded-lg text-base font-medium transition-colors ${
                  filterCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold">Nama Barang</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Kategori</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Jumlah</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Lokasi</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Kondisi</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Harga Satuan</th>
                <th className="px-6 py-4 text-left text-base font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems?.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-5 text-base font-medium">{item.name}</td>
                  <td className="px-6 py-5 text-base">{item.category}</td>
                  <td className="px-6 py-5 text-base font-semibold">{item.quantity}</td>
                  <td className="px-6 py-5 text-base">{item.location}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium border ${getConditionColor(item.condition)}`}>
                      {getConditionLabel(item.condition)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-base">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => navigate(`/inventaris/edit/${item.id}`)}>
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDeleteItem(Number(item.id))}>
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogClose className="absolute top-4 right-4 rounded-lg p-2 hover:bg-muted transition-colors" onClick={() => setShowDialog(false)}>
                </DialogClose>
                <DialogTitle className="text-lg font-semibold">Konfirmasi Hapus Item</DialogTitle>
              </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-xl font-semibold">Anda yakin ingin menghapus item ini?</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => confirmDeleteItem(selectedItemId)}
                            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Ya
                        </button>
                        <button
                            onClick={() => setShowDialog(false)}
                            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Tidak
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}