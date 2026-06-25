import { Search, X } from "lucide-react";
import BottomBrandsParfums from "../components/BottomBrandsParfums";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ReviewPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/perfumes"),
      fetch("http://localhost:3000/api/reviews")
    ])
      .then(async ([resPerfumes, resReviews]) => {
        if (resPerfumes.ok) setPerfumes(await resPerfumes.json());
        if (resReviews.ok) setReviews(await resReviews.json());
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar dados.");
      });
  }, []);

  const perfumesFitrado = perfumes.filter((perfume) => {
    return perfume.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-white/40  backdrop-blur-sm rounded-lg shadow-sm">
        <div className="flex flex-col gap-4">
          <h1 className="flex justify-center text-xl font-bold text-gray-800">
            {query === ""
              ? "Avaliações"
              : perfumesFitrado.length === 1 ? `Avaliações do "${perfumesFitrado[0].name}"`
                : perfumesFitrado.length === 0 ? `Nenhum perfume encontrado para "${query}"`
                  //: `Avaliações dos perfumes "${perfumesFitrado.map(p => p.name).join(", ")}"`
                  : "Avaliações"
            }
          </h1>
          <div className="w-full flex items-center relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Digite algo para buscar perfumes."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <X
              className={`w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600 transition-colors ${query.length === 0 ? "hidden" : "block"}`}
              onClick={() => setQuery("")}
            />
          </div>
          <div>
            {query === "" ? (
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-100 bg-white rounded-xl shadow-sm hover:border-teal-300 transition-colors cursor-pointer overflow-hidden flex flex-col sm:flex-row"
                    onClick={() => navigate(`/resenha/${review.id}`)}
                  >
                    <div className="sm:w-40 bg-gray-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0">
                      <img
                        src={review.perfumeImage || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop"}
                        alt={review.perfumeName}
                        className="w-full h-32 sm:h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-0.5">{review.perfumeBrand}</p>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{review.perfumeName}</h3>
                            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${review.perfumeGender === "Masculino" ? "bg-blue-500" : review.perfumeGender === "Feminino" ? "bg-pink-500" : "bg-teal-500"
                              }`}>
                              {review.perfumeGender}
                            </span>
                          </div>
                          <div className="flex bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 items-center shrink-0">
                            <span className="text-yellow-500 mr-1 text-sm">★</span>
                            <span className="font-bold text-yellow-700 text-sm">{review.rating} / 5</span>
                          </div>
                        </div>

                        <div className="my-4">
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">"{review.comment}"</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-700 font-bold text-xs uppercase">{review.userName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{review.userName}</p>
                            <p className="text-[10px] text-gray-500">
                              {new Date(review.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {review.longevidade != null && (
                            <div className="flex flex-col">
                              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Fixação</span>
                              <span className="text-xs font-bold text-teal-700">{review.longevidade}/5</span>
                            </div>
                          )}
                          {review.rastro != null && (
                            <div className="flex flex-col border-l border-gray-200 pl-3">
                              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Projeção</span>
                              <span className="text-xs font-bold text-purple-700">{review.rastro}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="text-lg font-bold text-center">Perfumes</span>
                {perfumesFitrado.map((perfume) => (
                  <div
                    key={perfume.id}
                    onClick={() => navigate(`/perfume/${perfume.id}`)}
                    className="border-b border-teal-500 bg-white w-full pb-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2"
                  >
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-36 h-48 object-cover mix-blend-multiply rounded-lg"
                    />
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between w-full">
                          <p className="font-bold text-gray-900">{perfume.name}</p>
                          <p className="text-gray-500">{perfume.year}</p>
                        </div>
                        <p className="text-sm text-gray-600">{perfume.brand}</p>
                      </div>
                      <div
                        className={`${perfume.gender === "Masculino" ? "text-blue-700 bg-gradient-to-r from-blue-300 to-transparent" : perfume.gender === "Feminino" ? "text-pink-700 bg-gradient-to-r from-pink-300 to-transparent" : "text-teal-700 bg-gradient-to-r from-teal-300 to-transparent"} rounded-full px-2 py-1 text-xs w-fit mt-1 self-start`}
                      >
                        <p className="font-bold">{perfume.gender}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <span className="text-lg font-bold text-center">Avaliações</span>
                {reviews
                  .filter((review) =>
                    perfumesFitrado.some((p) => p.id === review.perfumeId),
                  )
                  .map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-100 bg-white rounded-xl shadow-sm hover:border-teal-300 transition-colors cursor-pointer overflow-hidden flex flex-col sm:flex-row"
                      onClick={() => navigate(`/resenha/${review.id}`)}
                    >
                      <div className="sm:w-40 bg-gray-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0">
                        <img
                          src={review.perfumeImage || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop"}
                          alt={review.perfumeName}
                          className="w-full h-32 sm:h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <div>
                              <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-0.5">{review.perfumeBrand}</p>
                              <h3 className="font-bold text-gray-900 text-lg leading-tight">{review.perfumeName}</h3>
                              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${review.perfumeGender === "Masculino" ? "bg-blue-500" : review.perfumeGender === "Feminino" ? "bg-pink-500" : "bg-teal-500"
                                }`}>
                                {review.perfumeGender}
                              </span>
                            </div>
                            <div className="flex bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 items-center shrink-0">
                              <span className="text-yellow-500 mr-1 text-sm">★</span>
                              <span className="font-bold text-yellow-700 text-sm">{review.rating} / 5</span>
                            </div>
                          </div>

                          <div className="my-4">
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">"{review.comment}"</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-teal-700 font-bold text-xs uppercase">{review.userName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{review.userName}</p>
                              <p className="text-[10px] text-gray-500">
                                {new Date(review.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {review.longevidade != null && (
                              <div className="flex flex-col">
                                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Fixação</span>
                                <span className="text-xs font-bold text-teal-700">{review.longevidade}/5</span>
                              </div>
                            )}
                            {review.rastro != null && (
                              <div className="flex flex-col border-l border-gray-200 pl-3">
                                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Projeção</span>
                                <span className="text-xs font-bold text-purple-700">{review.rastro}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {reviews.filter((review) =>
                  perfumesFitrado.some((p) => p.id === review.perfumeId),
                ).length === 0 && perfumesFitrado.length > 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Nenhuma avaliação encontrada para este(s) perfume(s).
                    </p>
                  )}
              </div>
            )}
          </div>
          <BottomBrandsParfums />
        </div>
      </main>
    </>
  );
}
