import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar marcas");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const brand = brands.find((p) => p.id === deleteId);

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/brands/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBrands(brands.filter((p) => p.id !== deleteId));
        setDeleteId(null);
        toast.success(`Marca "${brand?.name}" excluída com sucesso!`);
      }
    } catch (error) {
      toast.error("Erro ao excluir marca");
    }
  };

  const brandToDelete = brands.find((p) => p.id === deleteId);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as casas de perfumaria do catálogo.
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/marcas/nova")}
          className="gap-2"
        >
          <Plus size={16} /> Nova Marca
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Marca</th>
                  <th className="px-6 py-4 font-medium">País</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {brand.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{brand.country}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/marcas/${brand.id}`)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(brand.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              marca
              <span className="font-semibold text-gray-900">
                {" "}
                {brandToDelete?.name}{" "}
              </span>
              dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
