import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Star, Clock, Wind, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import SidebarResenhasPerfumes from "../components/SidebarResenhasPerfumes";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/reviews/${id}`)
        .then(res => {
          if (!res.ok) throw new Error("Review not found");
          return res.json();
        })
        .then(data => {
          setReview(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          toast.error("Erro ao carregar a resenha.");
          setLoading(false);
        });
    }
  }, [id]);

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
              
              <div className="flex bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 items-center">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="font-bold text-yellow-700 text-lg">{review.rating} / 5</span>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Review Content */}
              <div className="mb-8 relative">
                <span className="absolute -top-4 -left-2 text-6xl text-gray-200 font-serif leading-none opacity-50 pointer-events-none">"</span>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line relative z-10 pl-4">
                  {review.comment}
                </p>
                <span className="absolute -bottom-6 right-0 text-6xl text-gray-200 font-serif leading-none opacity-50 pointer-events-none">"</span>
              </div>

              {/* Technical Metrics */}
              {(review.longevidade || review.rastro) && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Métricas Técnicas Avaliadas</h3>
                  <div className="flex flex-wrap gap-4">
                    {review.longevidade && (
                      <div className="flex bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 items-center gap-2 flex-1 min-w-[140px]">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-[10px] text-teal-600/80 uppercase font-bold tracking-wider">Fixação</p>
                          <p className="font-bold text-teal-800">{review.longevidade} / 5</p>
                        </div>
                      </div>
                    )}
                    {review.rastro && (
                      <div className="flex bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 items-center gap-2 flex-1 min-w-[140px]">
                        <Wind className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-[10px] text-purple-600/80 uppercase font-bold tracking-wider">Projeção</p>
                          <p className="font-bold text-purple-800">{review.rastro} / 5</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                    review.perfumeGender === "Masculino" ? "bg-blue-500" : review.perfumeGender === "Feminino" ? "bg-pink-500" : "bg-teal-500"
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
