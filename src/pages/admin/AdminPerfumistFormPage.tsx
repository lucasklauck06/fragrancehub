import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPerfumistFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== "novo";

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    photo: "",
    bio: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchPerfumist();
    }
  }, [id]);

  const fetchPerfumist = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/perfumists/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          country: data.country || "",
          photo: data.photo || "",
          bio: data.bio || "",
        });
      } else {
        toast.error("Perfumista não encontrado.");
        navigate("/admin/perfumistas");
      }
    } catch (error) {
      toast.error("Erro ao buscar dados do perfumista.");
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:3000/api/perfumists/${id}`
        : `http://localhost:3000/api/perfumists`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          `Perfumista ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`
        );
        navigate("/admin/perfumistas");
      } else {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.message || "Erro ao salvar perfumista.");
      }
    } catch (error) {
      toast.error("Erro na requisição ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-gray-500">
          Carregando dados do perfumista...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/perfumistas")}
          className="mb-4 text-gray-500 hover:text-gray-900 -ml-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Perfumistas
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Editar Perfumista" : "Novo Perfumista"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? "Atualize as informações biográficas e o país do criador."
            : "Adicione um novo profissional criador ao catálogo."}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Perfumista *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Alberto Morillas"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Ex: Espanha"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto</Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.value })
                }
                placeholder="https://exemplo.com/foto.jpg"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-600">Recomendado formato quadrado ou retrato. Será exibido no perfil.</p>
              {formData.photo && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Preview:</p>
                  <img 
                    src={formData.photo} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-full border border-gray-200" 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    onLoad={(e) => (e.currentTarget.style.display = 'block')}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="História do perfumista, suas inspirações e trajetória na perfumaria..."
                rows={6}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/perfumistas")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Perfumista"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
