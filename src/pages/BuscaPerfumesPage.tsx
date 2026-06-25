import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Search, SlidersHorizontal, RefreshCw, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Perfumer {
  id: string;
  name: string;
}

interface Perfume {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  perfumist: string;
  perfumistId: string;
  gender: string;
  price: number;
  year: number;
  image: string;
  description: string;
}

export default function BuscaPerfumesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input from layout or URL query
  const queryFromUrl = searchParams.get("q") || "";

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [perfumers, setPerfumers] = useState<Perfumer[]>([]);
  const [aromaticGroups, setAromaticGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedPerfumerId, setSelectedPerfumerId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>(searchParams.get("grupo") || "");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [priceRangePreset, setPriceRangePreset] = useState<string>("");

  // Sync search input with URL query when URL query changes
  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const grp = searchParams.get("grupo");
    if (grp) setSelectedGroupId(grp);
  }, [searchParams]);

  // Load backend data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPerfumes, resPerfumers, resGroups] = await Promise.all([
        fetch("http://localhost:3000/api/perfumes"),
        fetch("http://localhost:3000/api/perfumists"),
        fetch("http://localhost:3000/api/aromatic-groups")
      ]);

      if (resPerfumes.ok) {
        setPerfumes(await resPerfumes.json());
      } else {
        toast.error("Erro ao buscar catálogo de perfumes.");
      }

      if (resPerfumers.ok) {
        setPerfumers(await resPerfumers.json());
      }

      if (resGroups.ok) {
        setAromaticGroups(await resGroups.json());
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Handle gender selection toggling
  const handleGenderToggle = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  // Handle quick price preset selection
  const handlePricePreset = (preset: string, min: number | "", max: number | "") => {
    if (priceRangePreset === preset) {
      // Toggle off
      setPriceRangePreset("");
      setMinPrice("");
      setMaxPrice("");
    } else {
      setPriceRangePreset(preset);
      setMinPrice(min);
      setMaxPrice(max);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenders([]);
    setSelectedPerfumerId("");
    setSelectedGroupId("");
    setMinPrice("");
    setMaxPrice("");
    setPriceRangePreset("");
    setSearchParams({});
  };

  // Handle Search Input submit (sync with URL query)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams: Record<string, string> = {};
    if (searchQuery.trim()) {
      newParams.q = searchQuery;
    }
    setSearchParams(newParams);
  };

  // Dynamic filter application in-memory
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter(p => {
      // 1. Search Query Match
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(term);
        const matchesBrand = p.brand?.toLowerCase().includes(term);
        const matchesDesc = p.description?.toLowerCase().includes(term);
        const matchesPerfumist = p.perfumist?.toLowerCase().includes(term);
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesPerfumist) {
          return false;
        }
      }

      // 2. Gender Match
      if (selectedGenders.length > 0 && !selectedGenders.includes(p.gender)) {
        return false;
      }

      // 3. Perfumer Match
      if (selectedPerfumerId && p.perfumistId !== selectedPerfumerId) {
        return false;
      }

      // 4. Min Price Match
      if (minPrice !== "" && p.price < minPrice) {
        return false;
      }

      // 5. Max Price Match
      if (maxPrice !== "" && p.price > maxPrice) {
        return false;
      }

      // 6. Group Match
      if (selectedGroupId && p.aromaticGroupId !== selectedGroupId) {
        return false;
      }

      return true;
    });
  }, [perfumes, searchQuery, selectedGenders, selectedPerfumerId, selectedGroupId, minPrice, maxPrice]);

  return (
    <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-white/40 backdrop-blur-sm rounded-lg shadow-sm">
      {/* Title block */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Perfumes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore o portfólio completo da plataforma, refinando por gênero, valores e autoria profissional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                Filtros Avançados
              </span>
              {(searchQuery || selectedGenders.length > 0 || selectedPerfumerId || selectedGroupId || minPrice !== "" || maxPrice !== "") && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Limpar
                </button>
              )}
            </div>

            <div className="p-5 space-y-6">
              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Gênero</label>
                <div className="flex flex-col gap-2">
                  {["Masculino", "Feminino", "Unissex"].map((g) => {
                    const isChecked = selectedGenders.includes(g);
                    return (
                      <button
                        key={g}
                        onClick={() => handleGenderToggle(g)}
                        className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg border text-left font-medium transition-all duration-200 cursor-pointer ${isChecked
                          ? g === "Masculino"
                            ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                            : g === "Feminino"
                              ? "bg-pink-50 border-pink-200 text-pink-700 font-semibold"
                              : "bg-teal-50 border-teal-200 text-teal-700 font-semibold"
                          : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <span>{g}</span>
                        {isChecked && <span className="text-[10px] uppercase font-bold">Ativo</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Faixa de Preço</label>

                {/* Price presets */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
                    { label: "Até R$ 150", preset: "low", min: "", max: 150 },
                    { label: "R$ 150 - 300", preset: "mid", min: 150, max: 300 },
                    { label: "R$ 300 - 500", preset: "high", min: 300, max: 500 },
                    { label: "R$ 500+", preset: "ultra", min: 500, max: "" }
                  ].map((preset) => (
                    <button
                      key={preset.preset}
                      type="button"
                      onClick={() => handlePricePreset(preset.preset, preset.min as any, preset.max as any)}
                      className={`text-[10px] font-bold p-1.5 rounded-lg border text-center transition-all duration-200 cursor-pointer ${priceRangePreset === preset.preset
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom inputs */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400">Min</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
                        setPriceRangePreset(""); // clear preset
                      }}
                      className="w-full text-xs border border-gray-200 rounded-lg pl-9 pr-2 py-2 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <span className="text-gray-300">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400">Max</span>
                    <input
                      type="number"
                      placeholder="999"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
                        setPriceRangePreset(""); // clear preset
                      }}
                      className="w-full text-xs border border-gray-200 rounded-lg pl-9 pr-2 py-2 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Aromatic Group Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Família Olfativa</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value);
                    if (!e.target.value) {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete("grupo");
                      setSearchParams(newParams);
                    } else {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("grupo", e.target.value);
                      setSearchParams(newParams);
                    }
                  }}
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer"
                >
                  <option value="">Todos os grupos</option>
                  {aromaticGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* Perfumer Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Autor / Perfumista</label>
                <select
                  value={selectedPerfumerId}
                  onChange={(e) => setSelectedPerfumerId(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer"
                >
                  <option value="">Todos os perfumistas</option>
                  {perfumers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle/Right Listing & Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Custom Search bar at top of list */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Busque por nome do perfume, marca, notas ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchParams({});
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* <Button type="submit" className="bg-teal-600 hover:bg-teal-700 px-6 rounded-xl font-bold shadow-sm cursor-pointer">
              Pesquisar
            </Button> */}
          </form>

          {/* Results Metadata */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-sm font-semibold text-gray-500">
              Mostrando {filteredPerfumes.length} {filteredPerfumes.length === 1 ? "fragrância encontrada" : "fragrâncias encontradas"}
            </span>
          </div>

          {/* Perfumes Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500 font-medium animate-pulse">Sincronizando banco de dados...</p>
            </div>
          ) : filteredPerfumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPerfumes.map((perfume) => (
                <Card
                  key={perfume.id}
                  className={`overflow-hidden border border-gray-100 hover:border-teal-500/30 bg-white/95 rounded-xl hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
                  onClick={() => navigate(`/perfume/${perfume.id}`)}
                >
                  <div>
                    {/* Image Block */}
                    <div className="relative aspect-square bg-gray-50/50 border-b border-gray-50 p-6 flex items-center justify-center overflow-hidden">
                      <img
                        src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop"}
                        alt={perfume.name}
                        className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Shine effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-out pointer-events-none"></div>

                      {/* Gender Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm ${perfume.gender === "Masculino" ? "bg-blue-500" : perfume.gender === "Feminino" ? "bg-pink-500" : "bg-teal-500"
                          }`}>
                          {perfume.gender}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider truncate block w-2/3">
                          {perfume.brand}
                        </span>
                        {perfume.year && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {perfume.year}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                        {perfume.name}
                      </h3>
                      {perfume.perfumist && (
                        <p className="text-[11px] text-gray-400 font-medium">
                          Nose: <span className="font-semibold text-gray-500">{perfume.perfumist}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 line-clamp-2 pt-1 font-normal">
                        {perfume.description || "Nenhuma descrição técnica disponível para esta fragrância."}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-semibold">Valor Estimado</span>
                      <span className="text-sm font-bold text-teal-700">R$ {perfume.price.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Ver detalhes
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white/95 rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-base font-bold text-gray-800">Nenhum perfume atende aos filtros</p>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                Tente redefinir a busca por palavras-chave, remover filtros demográficos ou ajustar o limite de preços.
              </p>
              <Button onClick={handleClearFilters} className="mt-4 bg-teal-600 hover:bg-teal-700">
                Limpar Todos os Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
