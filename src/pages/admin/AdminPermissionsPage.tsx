import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import { Shield, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export default function AdminPermissionsPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let token = localStorage.getItem('token') || '';
      token = token.replace(/['"]+/g, ''); // Remove quotes if any

      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error(error);
      toast.error(`Erro ao carregar usuários: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update role');
      
      const updatedUser = await response.json();

      setUsers(users.map(u => u.id === userId ? { ...u, role: updatedUser.role } : u));

      toast.success(`Permissões de ${user.name} atualizadas.`, {
        className: 'bg-green-50 border-green-200',
      });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar permissão do usuário');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Controle de Permissões / Perfis de Acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">E-mail</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Data de Cadastro</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nível de Acesso</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground text-sm">{user.id.substring(0, 8)}...</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-700 font-semibold text-sm">
                              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as 'USER' | 'ADMIN')}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span>USER</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="ADMIN">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-purple-600" />
                                <span>ADMIN</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informações sobre Permissões</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>USER:</strong> Pode visualizar perfumes, deixar resenhas e explorar o catálogo</li>
              <li><strong>ADMIN:</strong> Acesso total ao painel administrativo, incluindo CRUDs e gestão de usuários</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
