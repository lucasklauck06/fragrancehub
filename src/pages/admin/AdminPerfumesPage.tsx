import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Pencil, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

type SortField = 'id' | 'name' | 'brand' | 'perfumist' | 'price' | null;
type SortDirection = 'asc' | 'desc';

export default function AdminPerfumesPage() {
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/perfumes");
      if (res.ok) {
        const data = await res.json();
        setPerfumes(data);
      }
    } catch (error) {
      console.error("Error fetching perfumes", error);
      toast.error("Erro ao carregar os perfumes");
    }
  };

  const handleSort = (field: SortField) => {
    const isNumeric = field === 'id' || field === 'price';

    if (sortField === field) {
      // Cycle: for numeric (desc → asc → reset), for text (asc → desc → reset)
      if (isNumeric) {
        if (sortDirection === 'desc') {
          setSortDirection('asc');
        } else {
          setSortField(null);
          setSortDirection('asc');
        }
      } else {
        if (sortDirection === 'asc') {
          setSortDirection('desc');
        } else {
          setSortField(null);
          setSortDirection('asc');
        }
      }
    } else {
      setSortField(field);
      // Default: high-to-low (desc) for numeric, A-Z (asc) for text
      setSortDirection(isNumeric ? 'desc' : 'asc');
    }
  };

  const filteredAndSortedPerfumes = useMemo(() => {
    let result = [...perfumes];

    // Filter by search query (name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case 'id': {
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);
            comparison = idA - idB;
            break;
          }
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name, 'pt-BR');
            break;
          case 'brand':
            comparison = a.brand.localeCompare(b.brand, 'pt-BR');
            break;
          case 'perfumist':
            comparison = a.perfumist.localeCompare(b.perfumist, 'pt-BR');
            break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [perfumes, searchQuery, sortField, sortDirection]);

  const handleDelete = async () => {
    if (!deleteId) return;

    const perfume = perfumes.find(p => p.id === deleteId);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/perfumes/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setPerfumes(perfumes.filter(p => p.id !== deleteId));
        setDeleteId(null);
        toast.success(`Perfume "${perfume?.name}" excluído com sucesso!`, {
          className: 'bg-green-50 border-green-200',
        });
      } else {
        toast.error("Erro ao excluir o perfume");
      }
    } catch (error) {
      toast.error("Erro ao excluir o perfume");
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

  const perfumeToDelete = perfumes.find(p => p.id === deleteId);

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciar Perfumes</CardTitle>
            <Button onClick={() => navigate('/admin/perfumes/novo')} className="gap-2 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4" />
              Novo Cadastro
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
                placeholder="Pesquisar por nome do perfume..."
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
                {filteredAndSortedPerfumes.length} {filteredAndSortedPerfumes.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('id')}>
                      ID {getSortIcon('id')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('name')}>
                      Nome {getSortIcon('name')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('brand')}>
                      Marca {getSortIcon('brand')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('perfumist')}>
                      Perfumista {getSortIcon('perfumist')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('price')}>
                      Preço {getSortIcon('price')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perfumes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Carregando perfumes...
                    </td>
                  </tr>
                ) : filteredAndSortedPerfumes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      {searchQuery
                        ? `Nenhum perfume encontrado para "${searchQuery}"`
                        : "Nenhum perfume cadastrado. Adicione um novo para começar!"}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedPerfumes.map((perfume) => (
                    <tr key={perfume.id} className="hover:bg-muted/50/50 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">{perfume.id}</td>
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                        {perfume.image ? (
                          <img src={perfume.image} alt={perfume.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold border border-border">
                            {perfume.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {perfume.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{perfume.brand}</td>
                      <td className="px-6 py-4 text-muted-foreground">{perfume.perfumist || "Não informado"}</td>
                      <td className="px-6 py-4 text-muted-foreground">R$ {perfume.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/perfumes/${perfume.id}`)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(perfume.id)}
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

      {/* Modal de Confirmação */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o item <strong>"{perfumeToDelete?.name}"</strong>?
              <br />
              <span className="text-red-600 font-medium">Esta ação é irreversível.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

