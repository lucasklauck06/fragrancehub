import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
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
    perfumeIds: [] as string[],
  });

  const [allPerfumes, setAllPerfumes] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perfRes = await fetch("http://localhost:3000/api/perfumes");
        if (perfRes.ok) {
          setAllPerfumes(await perfRes.json());
        }

        if (isEditing) {
          const res = await fetch(`http://localhost:3000/api/perfumists/${id}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              name: data.name || "",
              country: data.country || "",
              photo: data.photo || "",
              bio: data.bio || "",
              perfumeIds: data.perfumes ? data.perfumes.map((p: any) => p.id) : [],
            });
          } else {
            toast.error("Perfumista não encontrado.");
            navigate("/admin/perfumistas");
          }
        }
      } catch (error) {
        toast.error("Erro ao carregar dados.");
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const togglePerfume = (perfumeId: string) => {
    setFormData(prev => {
      const isSelected = prev.perfumeIds.includes(perfumeId);
      if (isSelected) {
        return { ...prev, perfumeIds: prev.perfumeIds.filter(i => i !== perfumeId) };
      } else {
        return { ...prev, perfumeIds: [...prev.perfumeIds, perfumeId] };
      }
    });
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
        <div className="flex items-center justify-center py-20 text-muted-foreground">
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
          className="mb-4 text-muted-foreground hover:text-foreground -ml-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Perfumistas
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? "Editar Perfumista" : "Novo Perfumista"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
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
              <Label>Perfumes Associados</Label>
              <p className="text-xs text-muted-foreground mb-2">Selecione os perfumes criados por este perfumista:</p>
              <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allPerfumes.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-2">Nenhum perfume encontrado no sistema.</p>
                  ) : (
                    allPerfumes.map(perfume => (
                      <div key={perfume.id} className="flex items-center space-x-3 bg-background p-2 rounded border border-border shadow-sm">
                        <Checkbox
                          id={`perfume-${perfume.id}`}
                          checked={formData.perfumeIds.includes(perfume.id)}
                          onCheckedChange={() => togglePerfume(perfume.id)}
                          disabled={isSubmitting}
                        />
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {perfume.image ? (
                            <img src={perfume.image} alt={perfume.name} className="w-8 h-8 object-contain mix-blend-multiply" />
                          ) : (
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">P</div>
                          )}
                          <Label htmlFor={`perfume-${perfume.id}`} className="text-sm font-medium cursor-pointer truncate">
                            {perfume.name}
                            <span className="block text-[10px] text-muted-foreground font-normal">{perfume.brand}</span>
                          </Label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
              <p className="text-xs text-muted-foreground">Recomendado formato quadrado ou retrato. Será exibido no perfil.</p>
              {formData.photo && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Preview:</p>
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border border-border"
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
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting || (!isEditing && !formData.name.trim())}
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
