import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

export default function AdminPerfumeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== 'novo';

  const [brands, setBrands] = useState<any[]>([]);
  const [perfumists, setPerfumists] = useState<any[]>([]);
  const [aromaticGroups, setAromaticGroups] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    perfumistId: '',
    aromaticGroupId: '',
    gender: 'Masculino',
    price: 0,
    year: new Date().getFullYear(),
    image: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBrandsAndPerfumists();
    if (isEdit) {
      fetchPerfume();
    }
  }, [id, isEdit]);

  const fetchBrandsAndPerfumists = async () => {
    try {
      const [resBrands, resPerfumists, resGroups] = await Promise.all([
        fetch("http://localhost:3000/api/brands"),
        fetch("http://localhost:3000/api/perfumists"),
        fetch("http://localhost:3000/api/aromatic-groups")
      ]);
      if (resBrands.ok) setBrands(await resBrands.json());
      if (resPerfumists.ok) setPerfumists(await resPerfumists.json());
      if (resGroups.ok) setAromaticGroups(await resGroups.json());
    } catch (error) {
      toast.error("Erro ao carregar marcas e perfumistas.");
    }
  };

  const fetchPerfume = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/perfumes/${id}`);
      if (res.ok) {
        const perfume = await res.json();
        setFormData({
          name: perfume.name || '',
          brandId: perfume.brandId || '',
          perfumistId: perfume.perfumistId || '',
          aromaticGroupId: perfume.aromaticGroupId || '',
          gender: perfume.gender || 'Masculino',
          price: perfume.price || 0,
          year: perfume.year || new Date().getFullYear(),
          image: perfume.image || '',
          topNotes: perfume.topNotes ? perfume.topNotes.join(', ') : '',
          heartNotes: perfume.heartNotes ? perfume.heartNotes.join(', ') : '',
          baseNotes: perfume.baseNotes ? perfume.baseNotes.join(', ') : '',
          description: perfume.description || '',
        });
      }
    } catch (error) {
      toast.error("Erro ao carregar perfume.");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.brandId) newErrors.brandId = 'Marca é obrigatória';
    if (!formData.perfumistId) newErrors.perfumistId = 'Perfumista é obrigatório';
    if (formData.price <= 0) newErrors.price = 'Preço deve ser maior que zero';
    if (!formData.gender) newErrors.gender = 'Gênero é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Corrija os erros no formulário');
      return;
    }

    const perfumeData = {
      name: formData.name,
      brandId: formData.brandId,
      perfumistId: formData.perfumistId,
      aromaticGroupId: formData.aromaticGroupId || undefined,
      gender: formData.gender,
      price: Number(formData.price),
      year: Number(formData.year),
      image: formData.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop',
      topNotes: formData.topNotes.split(',').map(n => n.trim()).filter(Boolean),
      heartNotes: formData.heartNotes.split(',').map(n => n.trim()).filter(Boolean),
      baseNotes: formData.baseNotes.split(',').map(n => n.trim()).filter(Boolean),
      description: formData.description,
    };

    try {
      const token = localStorage.getItem("token");
      const url = isEdit ? `http://localhost:3000/api/perfumes/${id}` : `http://localhost:3000/api/perfumes`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(perfumeData)
      });

      if (res.ok) {
        toast.success('Registro salvo com sucesso!', {
          className: 'bg-green-50 border-green-200',
        });
        navigate('/admin/perfumes');
      } else {
        toast.error('Erro ao salvar o registro.');
      }
    } catch (error) {
      toast.error('Erro ao salvar o registro.');
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Editar Perfume' : 'Novo Perfume'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Perfume *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Sauvage Elixir"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Select value={formData.brandId} onValueChange={(v) => handleChange('brandId', v)}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Selecione uma marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandId && <p className="text-sm text-red-600">{errors.brandId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="perfumist">Perfumista *</Label>
                <Select value={formData.perfumistId} onValueChange={(v) => handleChange('perfumistId', v)}>
                  <SelectTrigger id="perfumist">
                    <SelectValue placeholder="Selecione um perfumista" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfumists.map(perfumist => (
                      <SelectItem key={perfumist.id} value={perfumist.id}>
                        {perfumist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.perfumistId && <p className="text-sm text-red-600">{errors.perfumistId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aromaticGroup">Grupo Aromático</Label>
                <Select value={formData.aromaticGroupId} onValueChange={(v) => handleChange('aromaticGroupId', v)}>
                  <SelectTrigger id="aromaticGroup">
                    <SelectValue placeholder="Opcional: Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {aromaticGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Unissex">Unissex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                />
                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano de Lançamento</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={formData.year}
                  onChange={(e) => handleChange('year', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-xs text-gray-600">Exemplo: https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop</p>
              {formData.image && <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover mt-2" />}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pirâmide Olfativa</h3>
              <p className="text-sm text-gray-600">Separe as notas por vírgula (ex: Bergamota, Lavanda, Cedro)</p>

              <div className="space-y-2">
                <Label htmlFor="topNotes">Notas de Topo</Label>
                <Input
                  id="topNotes"
                  value={formData.topNotes}
                  onChange={(e) => handleChange('topNotes', e.target.value)}
                  placeholder="Ex: Bergamota, Limão, Hortelã"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartNotes">Notas de Coração</Label>
                <Input
                  id="heartNotes"
                  value={formData.heartNotes}
                  onChange={(e) => handleChange('heartNotes', e.target.value)}
                  placeholder="Ex: Lavanda, Gerânio, Rosa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseNotes">Notas de Base</Label>
                <Input
                  id="baseNotes"
                  value={formData.baseNotes}
                  onChange={(e) => handleChange('baseNotes', e.target.value)}
                  placeholder="Ex: Cedro, Âmbar, Almíscar"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Descreva o perfume, suas características e ocasiões de uso..."
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/perfumes')}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={!isEdit && (!formData.name.trim() || !formData.brandId || !formData.perfumistId || formData.price <= 0 || !formData.gender || !formData.description.trim())}
              >
                {isEdit ? "Salvar Alterações" : "Criar Perfume"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
