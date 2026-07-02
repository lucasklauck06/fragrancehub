import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Pencil, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

type SortField = 'name' | 'country' | null;
type SortDirection = 'asc' | 'desc';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brands];

    // Filter by search query (name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(b => b.name.toLowerCase().includes(query));
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name, 'pt-BR');
            break;
          case 'country':
            comparison = (a.country || '').localeCompare(b.country || '', 'pt-BR');
            break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [brands, searchQuery, sortField, sortDirection]);

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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 ml-1 text-green-600" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 ml-1 text-green-600" />;
  };

  const brandToDelete = brands.find((p) => p.id === deleteId);

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Marcas</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie as casas de perfumaria do catálogo.
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin/marcas/nova")}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} /> Nova Marca
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Field */}
          <div className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar por nome da marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground text-sm font-medium"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-1.5">
                {filteredAndSortedBrands.length} {filteredAndSortedBrands.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span
                      className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('name')}
                    >
                      Marca {getSortIcon('name')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span
                      className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('country')}
                    >
                      País {getSortIcon('country')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedBrands.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                      {searchQuery
                        ? `Nenhuma marca encontrada para "${searchQuery}"`
                        : "Nenhuma marca cadastrada"}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedBrands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="hover:bg-muted/50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {brand.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{brand.country}</td>
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
                  ))
                )}
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
              <span className="font-semibold text-foreground">
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
