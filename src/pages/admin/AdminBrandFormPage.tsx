import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminBrandFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== "nova";

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchBrand();
    }
  }, [id]);

  const fetchBrand = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/brands/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name,
          country: data.country || "",
          image: data.image || "",
          description: data.description || "",
        });
      }
    } catch (error) {
      toast.error("Erro ao buscar marca.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:3000/api/brands/${id}`
        : `http://localhost:3000/api/brands`;

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
          `Marca ${isEditing ? "atualizada" : "criada"} com sucesso!`,
        );
        navigate("/admin/marcas");
      } else {
        toast.error("Erro ao salvar marca");
      }
    } catch (error) {
      toast.error("Erro na requisição");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/marcas")}
          className="mb-4 text-gray-500 hover:text-gray-900 -ml-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Marcas
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Editar Marca" : "Nova Marca"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? "Atualize as informações da marca."
            : "Adicione uma nova casa de perfumaria."}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Marca *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Chanel"
                required
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
                placeholder="Ex: França"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-xs text-gray-600">Exemplo: https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop</p>
              {formData.image && <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover mt-2" />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="História da marca, características principais..."
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/marcas")}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {isEditing ? "Salvar Alterações" : "Criar Marca"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
