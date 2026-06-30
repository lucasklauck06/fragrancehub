import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Tag, User, Star, Clock, Send, Award, Layers, Wind } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import SidebarResenhasPerfumes from "../components/SidebarResenhasPerfumes";
import { LongevitySlider, SillageSlider, OccasionSelector, occasionOptions } from "../components/VotingMetrics";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  longevidade?: number | null;
  rastro?: number | null;
  quandoUsar?: string | null;
  date: string;
  userId: string;
}

interface Perfume {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  perfumist: string;
  perfumistId: string;
  brandName?: string;
  perfumistName?: string;
  gender: string;
  price: number;
  year: number;
  image: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  collection?: string;
  reviews: Review[];
}

export default function PerfumeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [brandPerfumes, setBrandPerfumes] = useState<any[]>([]);
  const [collectionPerfumes, setCollectionPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [longevidade, setLongevidade] = useState(0);
  const [rastro, setRastro] = useState(0);
  const [quandoUsar, setQuandoUsar] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPerfumeDetails();
    }
  }, [id]);

  const fetchPerfumeDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch perfume detail (includes brand, perfumist, and reviews)
      const res = await fetch(`http://localhost:3000/api/perfumes/${id}`);
      if (!res.ok) throw new Error("Perfume não encontrado");
      const data = await res.json();
      setPerfume(data);

      // 2. Fetch other perfumes of the same brand
      if (data.brandId) {
        const resBrand = await fetch(`http://localhost:3000/api/perfumes?brandId=${data.brandId}`);
        if (resBrand.ok) {
          const brandData = await resBrand.json();
          // Filter out the current perfume
          setBrandPerfumes(brandData.filter((p: any) => p.id !== id));
        }
      }

      // 3. Fetch other perfumes of the same collection (if exists)
      if (data.collection) {
        const resColl = await fetch(`http://localhost:3000/api/perfumes?collection=${encodeURIComponent(data.collection)}`);
        if (resColl.ok) {
          const collData = await resColl.json();
          setCollectionPerfumes(collData.filter((p: any) => p.id !== id));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar detalhes do perfume.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Você precisa estar logado para publicar uma resenha.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Escreva um comentário para sua resenha.");
      return;
    }
    if (longevidade === 0) {
      toast.error("Por favor, avalie a fixação (longevidade).");
      return;
    }
    if (rastro === 0) {
      toast.error("Por favor, avalie a projeção (rastro).");
      return;
    }
    if (!quandoUsar) {
      toast.error("Por favor, selecione a ocasião ou estação recomendada (quando usar).");
      return;
    }

    setSubmittingReview(true);
    try {
      let token = localStorage.getItem('token') || '';
      token = token.replace(/['"]+/g, ''); // Remove quotes if any

      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          perfumeId: id,
          rating,
          comment,
          longevidade,
          rastro,
          quandoUsar,
        })
      });

      if (res.status === 401) {
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
        navigate('/login');
        return;
      }

      if (res.ok) {
        toast.success("Resenha publicada com sucesso!");
        setComment("");
        setRating(5);
        setLongevidade(0);
        setRastro(0);
        setQuandoUsar("");
        fetchPerfumeDetails(); // reload data
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Erro ao enviar resenha.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar resenha.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Carregando detalhes técnicos...</p>
        </div>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">Perfume não encontrado</p>
          <Button onClick={() => navigate("/")} className="mt-4">Voltar para Início</Button>
        </div>
      </div>
    );
  }

  // Calculate Accords based on notes
  const getAccords = (top: string[], heart: string[], base: string[]) => {
    const allNotes = [...top, ...heart, ...base].map(n => n.toLowerCase());
    const categories = [
      { name: "Cítrico", color: "from-amber-400 to-yellow-500", keywords: ["limão", "bergamota", "tangerina", "laranja", "néroli", "mandarina", "grapefruit", "citrus", "limon"] },
      { name: "Amadeirado", color: "from-amber-800 to-amber-900", keywords: ["cedro", "sândalo", "patchouli", "vetiver", "âmbar", "musgo", "oud", "madeira", "sandalwood", "cedar"] },
      { name: "Floral", color: "from-pink-400 to-rose-500", keywords: ["rosa", "jasmim", "lavanda", "gerânio", "íris", "violeta", "ylang", "neroli", "tuberosa", "jasmine", "rose", "lavender"] },
      { name: "Doce / Baunilha", color: "from-yellow-600 to-yellow-700", keywords: ["baunilha", "fava tonka", "mel", "caramelo", "praliné", "vanilla", "honey", "tonka"] },
      { name: "Especiado", color: "from-red-500 to-orange-600", keywords: ["pimenta", "canela", "cravo", "cardamomo", "noz-moscada", "pepper", "cinnamon", "clove", "spicy"] },
      { name: "Atalcado", color: "from-indigo-300 to-purple-400", keywords: ["atalcado", "iris", "violeta", "almíscar", "heliotrópio", "musk"] },
      { name: "Couro", color: "from-slate-700 to-slate-900", keywords: ["couro", "camurça", "tabaco", "leather", "tobacco"] },
      { name: "Fresco / Herbal", color: "from-green-400 to-emerald-600", keywords: ["hortelã", "notas verdes", "alecrim", "manjericão", "eucalipto", "mint", "herbal", "fresh"] }
    ];

    let matches = categories.map(cat => {
      let count = 0;
      allNotes.forEach(note => {
        cat.keywords.forEach(keyword => {
          if (note.includes(keyword)) count += 1.5;
        });
      });
      return { name: cat.name, color: cat.color, weight: count };
    }).filter(c => c.weight > 0);

    if (matches.length === 0) {
      matches = [
        { name: "Fresco", color: "from-teal-400 to-cyan-500", weight: 8 },
        { name: "Especiado", color: "from-red-500 to-orange-600", weight: 6 },
        { name: "Amadeirado", color: "from-amber-800 to-amber-900", weight: 5 }
      ];
    }

    matches.sort((a, b) => b.weight - a.weight);
    const total = matches.reduce((sum, item) => sum + item.weight, 0);
    return matches.map(item => ({
      ...item,
      percentage: Math.round((item.weight / total) * 100)
    }));
  };

  const accords = getAccords(perfume.topNotes || [], perfume.heartNotes || [], perfume.baseNotes || []);

  // Performance calculations
  const getPerformance = (accs: typeof accords) => {
    let longevityBase = 50;
    let sillageBase = 50;

    accs.forEach(a => {
      if (a.name === "Amadeirado" || a.name === "Couro" || a.name === "Doce / Baunilha") {
        longevityBase += (a.percentage * 0.4);
        sillageBase += (a.percentage * 0.2);
      }
      if (a.name === "Cítrico" || a.name === "Fresco / Herbal") {
        longevityBase -= (a.percentage * 0.2);
        sillageBase -= (a.percentage * 0.1);
      }
      if (a.name === "Especiado") {
        sillageBase += (a.percentage * 0.3);
      }
    });

    const longevity = Math.max(30, Math.min(95, Math.round(longevityBase)));
    const sillage = Math.max(30, Math.min(95, Math.round(sillageBase)));

    const getLongevityText = (val: number) => {
      if (val < 45) return "Fraca (2h - 4h)";
      if (val < 65) return "Moderada (4h - 6h)";
      if (val < 85) return "Longa Duração (6h - 8h)";
      return "Eterna (8h+)";
    };

    const getSillageText = (val: number) => {
      if (val < 45) return "Íntimo";
      if (val < 65) return "Moderado";
      if (val < 85) return "Marcante / Forte";
      return "Enorme";
    };

    return {
      longevity,
      sillage,
      longevityText: getLongevityText(longevity),
      sillageText: getSillageText(sillage)
    };
  };

  const performance = getPerformance(accords);

  // Reviews calculation
  const totalReviews = perfume.reviews ? perfume.reviews.length : 0;
  const averageRating = totalReviews > 0
    ? (perfume.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  let mostCommonOcasião = "Não avaliado";
  if (totalReviews > 0) {
    const counts: Record<string, number> = {};
    perfume.reviews.forEach(r => {
      if (r.quandoUsar) {
        counts[r.quandoUsar] = (counts[r.quandoUsar] || 0) + 1;
      }
    });
    let max = 0;
    for (const [key, val] of Object.entries(counts)) {
      if (val > max) {
        max = val;
        mostCommonOcasião = key;
      }
    }
  }

  return (
    <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-white/40 backdrop-blur-sm rounded-lg shadow-sm">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-gray-100/50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Perfume Card */}
          <Card className="overflow-hidden border border-gray-100 bg-white/95 shadow-sm rounded-xl">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Image & Price */}
              <div className="md:w-1/3 flex flex-col items-center gap-4">
                <div className="relative group overflow-hidden rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-4 h-64 w-full">
                  <img
                    src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop"}
                    alt={perfume.name}
                    className="h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm tracking-wide ${perfume.gender === "Masculino" ? "bg-blue-500" : perfume.gender === "Feminino" ? "bg-pink-500" : "bg-teal-500"
                      }`}>
                      {perfume.gender}
                    </span>
                  </div>
                </div>
                <div className="text-center w-full bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-3 rounded-lg border border-teal-500/20">
                  <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">Valor Estimado</span>
                  <span className="text-2xl font-bold text-teal-700">R$ {perfume.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Title and Attributes */}
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <Link to={`/marca/${perfume.brandId}`} className="text-sm font-semibold text-teal-600 hover:underline uppercase tracking-wider">
                      {perfume.brandName || perfume.brand}
                    </Link>
                    {perfume.year && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        Lançamento: {perfume.year}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {perfume.name}
                  </h1>

                  {/* Perfumist link */}
                  <div className="flex items-center gap-2 mb-4 bg-purple-50/50 p-2 rounded-lg border border-purple-100/50 w-fit">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-gray-500 font-medium">Perfumista:</span>
                    <Link to={`/perfumista/${perfume.perfumistId}`} className="text-xs font-bold text-purple-700 hover:underline">
                      {perfume.perfumistName || perfume.perfumist}
                    </Link>
                  </div>

                  {perfume.collection && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded w-fit mb-4">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Coleção: <strong>{perfume.collection}</strong></span>
                    </div>
                  )}

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {perfume.description || "Este perfume é uma fragrância sofisticada pertencente ao portfólio exclusivo de nossa marca, desenvolvida meticulosamente pelos narizes mais experientes para proporcionar uma jornada sensorial única e inesquecível."}
                  </p>
                </div>

                {/* Accords Section */}
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Principais Acordes</h3>
                  <div className="space-y-2">
                    {accords.map((accord) => (
                      <div key={accord.name} className="space-y-0.5">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{accord.name}</span>
                          <span>{accord.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${accord.color}`} style={{ width: `${accord.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Olfactory Pyramid & Technical details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pyramid */}
            <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600" />
                  Pirâmide Olfativa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {/* Top Notes */}
                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">Notas de Topo (Saída)</span>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {perfume.topNotes && perfume.topNotes.length > 0 ? perfume.topNotes.join(", ") : "Notas Cítricas, Frescor"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Perceptíveis nos primeiros 15 minutos pós-aplicação.</p>
                  </div>
                  {/* Heart Notes */}
                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">Notas de Coração (Corpo)</span>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {perfume.heartNotes && perfume.heartNotes.length > 0 ? perfume.heartNotes.join(", ") : "Notas Florais, Especiarias"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">A alma da fragrância, dura entre 2 a 4 horas.</p>
                  </div>
                  {/* Base Notes */}
                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-700 border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Notas de Base (Fundo)</span>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {perfume.baseNotes && perfume.baseNotes.length > 0 ? perfume.baseNotes.join(", ") : "Madeiras, Âmbar, Almíscar"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Dão sustentação, evaporam muito lentamente (8h+).</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Gauges */}
            <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Métricas Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Longevity Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>Longevidade (Fixação)</span>
                    <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">{performance.longevityText}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${performance.longevity}%` }}></div>
                  </div>
                </div>

                {/* Sillage Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>Rastro (Projeção / Silagem)</span>
                    <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">{performance.sillageText}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${performance.sillage}%` }}></div>
                  </div>
                </div>

                {/* Ocasião Recomendada */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>Ocasião / Estação (Quando Usar)</span>
                    {(() => {
                      const occInfo = occasionOptions.find(o => o.id === mostCommonOcasião);
                      if (occInfo) {
                        const Icon = occInfo.icon;
                        return (
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${occInfo.bg} ${occInfo.border}`}>
                            <Icon className={`w-3.5 h-3.5 ${occInfo.color}`} />
                            <span className={`text-xs font-bold ${occInfo.color}`}>{mostCommonOcasião}</span>
                          </div>
                        );
                      }
                      return (
                        <span className="text-xs text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{mostCommonOcasião}</span>
                      );
                    })()}
                  </div>
                </div>

                {/* Summary Evaluation */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Avaliação Geral</span>
                    <p className="text-sm font-bold text-gray-800">
                      Nota {averageRating} <span className="text-xs font-normal text-gray-500">({totalReviews} resenhas técnicas)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List & Write Review */}
          <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Resenhas dos Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Form to submit review */}
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-800">Compartilhe sua Avaliação Técnica</h4>

                  {/* Rating selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold">Sua Nota:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRating(val)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${val <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Longevidade técnica e Rastro */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-4 rounded-xl border border-gray-100">
                    <LongevitySlider value={longevidade} onChange={setLongevidade} />
                    <SillageSlider value={rastro} onChange={setRastro} />
                  </div>

                  {/* Quando usar */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <OccasionSelector selected={quandoUsar} onChange={setQuandoUsar} />
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    <textarea
                      placeholder="Descreva as características técnicas, longevidade, projeção, acordes dominantes..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/50"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5" disabled={submittingReview}>
                      <Send className="w-3.5 h-3.5" />
                      Publicar Resenha
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500">
                    Você precisa estar logado para publicar resenhas.{" "}
                    <Link to="/login" className="text-teal-600 font-bold hover:underline">Faça login aqui</Link>.
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {perfume.reviews && perfume.reviews.length > 0 ? (
                  perfume.reviews.map((review) => (
                    <div key={review.id} onClick={() => navigate(`/resenha/${review.id}`)} className="border-b border-teal-500 hover:rounded-md transition-all duration-500 ease-in-out hover:border-teal-200 hover:p-2 cursor-pointer hover:bg-teal-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{review.userName}</span>
                            <div className="flex bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100 items-center">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                              <span className="text-[10px] font-bold text-yellow-700">{review.rating}</span>
                            </div>
                            {review.longevidade && (
                              <div className="flex bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100 items-center gap-0.5">
                                <Clock className="w-3 h-3 text-teal-500 mr-0.5" />
                                <span className="text-[10px] font-bold text-teal-700">{review.longevidade}/5</span>
                              </div>
                            )}
                            {review.rastro && (
                              <div className="flex bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 items-center gap-0.5">
                                <Wind className="w-3 h-3 text-purple-500 mr-0.5" />
                                <span className="text-[10px] font-bold text-purple-700">{review.rastro}/5</span>
                              </div>
                            )}
                            {review.quandoUsar && (
                              (() => {
                                const occInfo = occasionOptions.find(o => o.id === review.quandoUsar);
                                if (occInfo) {
                                  const Icon = occInfo.icon;
                                  return (
                                    <div className={`flex ${occInfo.bg} px-1.5 py-0.5 rounded border ${occInfo.border} items-center gap-0.5`}>
                                      <Icon className={`w-3 h-3 ${occInfo.color} mr-0.5`} />
                                      <span className={`text-[10px] font-bold ${occInfo.color}`}>{review.quandoUsar}</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flex bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 items-center gap-0.5">
                                    <span className="text-[10px] font-bold text-orange-700">{review.quandoUsar}</span>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(review.date).toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-sm py-6">
                    Ainda não há resenhas técnicas para este perfume. Seja o primeiro a avaliar!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Related Brand Perfumes */}
          <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-600" />
                Da Mesma Casa ({perfume.brandName || perfume.brand})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {brandPerfumes.length > 0 ? (
                <div className="flex overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide">
                  {brandPerfumes.slice(0, 10).map((p) => (
                    <Link
                      key={p.id}
                      to={`/perfume/${p.id}`}
                      className="flex flex-col gap-2 hover:bg-gray-50/80 p-3 rounded-lg border border-transparent hover:border-gray-100 transition-all duration-200 min-w-[140px] snap-start"
                    >
                      <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-md bg-gray-50 shrink-0 shadow-sm" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-950 truncate block">{p.name}</span>
                        <span className="text-xs text-gray-500 font-medium block truncate">{p.gender} • {p.year}</span>
                        <span className="text-sm text-teal-600 font-bold block mt-1">R$ {p.price.toFixed(2)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Nenhuma outra fragrância desta marca cadastrada.</p>
              )}
            </CardContent>
          </Card>

          {/* Related Collection Perfumes */}
          {perfume.collection && (
            <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  Da Coleção ({perfume.collection})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {collectionPerfumes.length > 0 ? (
                  <div className="flex overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide">
                    {collectionPerfumes.slice(0, 10).map((p) => (
                      <Link
                        key={p.id}
                        to={`/perfume/${p.id}`}
                        className="flex flex-col gap-2 hover:bg-gray-50/80 p-3 rounded-lg border border-transparent hover:border-gray-100 transition-all duration-200 min-w-[140px] snap-start"
                      >
                        <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-md bg-gray-50 shrink-0 shadow-sm" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-gray-950 truncate block">{p.name}</span>
                          <span className="text-xs text-gray-500 font-medium block truncate">{p.brand}</span>
                          <span className="text-sm text-teal-600 font-bold block mt-1">R$ {p.price.toFixed(2)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">Nenhuma outra fragrância desta coleção cadastrada.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reviews Sidebar (Global) */}
          <SidebarResenhasPerfumes />
        </div>
      </div>
    </main>
  );
}
