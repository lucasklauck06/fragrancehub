import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { Trash2, Eye, Star, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

type SortField = 'userName' | 'perfumeName' | 'rating' | 'date' | null;
type SortDirection = 'asc' | 'desc';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token')?.replace(/['"]+/g, '');
      const res = await fetch('http://localhost:3000/api/reviews', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar resenhas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSort = (field: SortField) => {
    const isNumericOrDate = field === 'rating' || field === 'date';

    if (sortField === field) {
      if (isNumericOrDate) {
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
      setSortDirection(isNumericOrDate ? 'desc' : 'asc');
    }
  };

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.userName?.toLowerCase().includes(query) ||
        r.perfumeName?.toLowerCase().includes(query) ||
        r.perfumeBrand?.toLowerCase().includes(query) ||
        r.comment?.toLowerCase().includes(query)
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case 'userName':
            comparison = (a.userName || '').localeCompare(b.userName || '', 'pt-BR');
            break;
          case 'perfumeName':
            comparison = (a.perfumeName || '').localeCompare(b.perfumeName || '', 'pt-BR');
            break;
          case 'rating':
            comparison = (a.rating || 0) - (b.rating || 0);
            break;
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [reviews, searchQuery, sortField, sortDirection]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta resenha?')) return;
    try {
      const token = localStorage.getItem('token')?.replace(/['"]+/g, '');
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete review');
      toast.success('Resenha excluída com sucesso!');
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir resenha');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 ml-1 text-teal-600" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 ml-1 text-teal-600" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Resenhas</h1>
          <p className="text-muted-foreground mt-2">Visualize e gerencie todas as resenhas feitas no sistema.</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          {/* Search Field */}
          <div className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar por usuário, perfume, marca ou comentário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-1.5">
                {filteredAndSortedReviews.length} {filteredAndSortedReviews.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('userName')}>
                      Usuário {getSortIcon('userName')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('perfumeName')}>
                      Perfume {getSortIcon('perfumeName')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('rating')}>
                      Avaliação {getSortIcon('rating')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium select-none transition-colors">
                    <span className="inline-flex cursor-pointer items-center hover:text-primary transition-all duration-200"
                      onClick={() => handleSort('date')}>
                      Data {getSortIcon('date')}
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Carregando resenhas...
                    </td>
                  </tr>
                ) : filteredAndSortedReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      {searchQuery
                        ? `Nenhuma resenha encontrada para "${searchQuery}"`
                        : "Nenhuma resenha encontrada no sistema."}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-muted/50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{review.userName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-foreground">{review.perfumeName}</span>
                          <span className="text-xs text-muted-foreground">{review.perfumeBrand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md w-fit border border-yellow-100">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-yellow-700">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/resenha/${review.id}`}>
                            <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:text-teal-600 border-teal-200">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
