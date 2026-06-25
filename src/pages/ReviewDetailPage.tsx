import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Star, Clock, Wind, Calendar, User, Edit2 } from "lucide-react";
import { toast } from "sonner";
import SidebarResenhasPerfumes from "../components/SidebarResenhasPerfumes";
import { useAuth } from "../contexts/AuthContext";
import { LongevitySlider, SillageSlider, OccasionSelector } from "../components/VotingMetrics";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editLongevidade, setEditLongevidade] = useState(0);
  const [editRastro, setEditRastro] = useState(0);
  const [editQuandoUsar, setEditQuandoUsar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/reviews/${id}`)
        .then(res => {
          if (!res.ok) throw new Error("Review not found");
          return res.json();
        })
        .then(data => {
          setReview(data);
          setEditRating(data.rating);
          setEditComment(data.comment);
          setEditLongevidade(data.longevidade || 0);
          setEditRastro(data.rastro || 0);
          setEditQuandoUsar(data.quandoUsar || "");
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          toast.error("Erro ao carregar a resenha.");
          setLoading(false);
        });
    }
  }, [id]);

  const isAuthor = currentUser?.id === review?.userId;

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment,
          longevidade: editLongevidade,
          rastro: editRastro,
          quandoUsar: editQuandoUsar
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }
      
      setReview({ ...review, rating: editRating, comment: editComment, longevidade: editLongevidade, rastro: editRastro, quandoUsar: editQuandoUsar });
      setIsEditing(false);
      toast.success("Resenha atualizada com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar resenha.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-xl font-semibold text-gray-800 mb-4">Resenha não encontrada</p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
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
        {/* Left Column - Detailed Review */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border border-gray-100 bg-white/95 shadow-sm rounded-xl">
            {/* Header: User and Date */}
            <div className="bg-gray-50/50 border-b border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 font-bold text-xl uppercase">
                    {review.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    {review.userName}
                  </h2>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(review.date).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 items-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                  <span className="font-bold text-yellow-700 text-lg">{isEditing ? editRating : review.rating} / 5</span>
                </div>
                {isAuthor && !isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>

            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold">Nota:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button key={val} onClick={() => setEditRating(val)} type="button" className="cursor-pointer">
                          <Star className={`w-6 h-6 ${val <= editRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
                    rows={4}
                    placeholder="Sua avaliação detalhada..."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <LongevitySlider value={editLongevidade} onChange={setEditLongevidade} />
                    <SillageSlider value={editRastro} onChange={setEditRastro} />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <OccasionSelector selected={editQuandoUsar} onChange={setEditQuandoUsar} />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handleSave} disabled={saving}>Salvar Alterações</Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Review Content */}
                  <div className="mb-8 relative">
                    <span className="absolute -top-4 -left-2 text-6xl text-gray-200 font-serif leading-none opacity-50 pointer-events-none">"</span>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line relative z-10 pl-4">
                      {review.comment}
                    </p>
                    <span className="absolute -bottom-6 right-0 text-6xl text-gray-200 font-serif leading-none opacity-50 pointer-events-none">"</span>
                  </div>

              {/* Technical Metrics */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Métricas Técnicas Avaliadas</h3>
                  <div className="flex flex-wrap gap-4">
                    {review.longevidade != null ? (
                      <div className="flex bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 items-center gap-2 flex-1 min-w-[140px]">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-[10px] text-teal-600/80 uppercase font-bold tracking-wider">Fixação</p>
                          <p className="font-bold text-teal-800">{review.longevidade} / 5</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 items-center gap-2 flex-1 min-w-[140px]">
                        <p className="text-[10px] text-teal-600/80 uppercase font-bold tracking-wider">Sem fixação</p>
                      </div>
                    )}
                    {review.rastro != null ? (
                      <div className="flex bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 items-center gap-2 flex-1 min-w-[140px]">
                        <Wind className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-[10px] text-purple-600/80 uppercase font-bold tracking-wider">Projeção</p>
                          <p className="font-bold text-purple-800">{review.rastro} / 5</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 items-center gap-2 flex-1 min-w-[140px]">
                        <p className="text-[10px] text-purple-600/80 uppercase font-bold tracking-wider">Sem projeção</p>
                      </div>
                    )}
                    {review.quandoUsar != null ? (
                      <div className="flex bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 items-center gap-2 flex-1 min-w-[140px]">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-[10px] text-orange-600/80 uppercase font-bold tracking-wider">Ocasião</p>
                          <p className="font-bold text-orange-800">{review.quandoUsar}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 items-center gap-2 flex-1 min-w-[140px]">
                        <p className="text-[10px] text-orange-600/80 uppercase font-bold tracking-wider">Sem ocasião</p>
                      </div>
                    )}
                  </div>
                </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Perfume Card Info */}
          <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl overflow-hidden cursor-pointer hover:border-teal-200 transition-colors" onClick={() => navigate(`/perfume/${review.perfumeId}`)}>
            <div className="bg-gray-50 h-48 w-full flex items-center justify-center p-4 border-b border-gray-100">
              <img
                src={review.perfumeImage || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop"}
                alt={review.perfumeName}
                className="h-full object-contain mix-blend-multiply"
              />
            </div>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">{review.perfumeBrand}</p>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{review.perfumeName}</h3>
                <div className="flex justify-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${review.perfumeGender === "Masculino" ? "bg-blue-500" : review.perfumeGender === "Feminino" ? "bg-pink-500" : "bg-teal-500"
                    }`}>
                    {review.perfumeGender}
                  </span>
                </div>
                <p className="text-sm font-bold text-teal-800 bg-teal-50 rounded-lg py-1.5 w-max mx-auto px-4">
                  R$ {review.perfumePrice?.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Sidebar (Global) */}
          <SidebarResenhasPerfumes />
        </div>
      </div>
    </main>
  );
}
