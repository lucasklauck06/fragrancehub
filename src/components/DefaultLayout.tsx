import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Search as SearchIcon,
  User,
  LogOut,
  ChevronDown,
  Search,
  Tag,
  ArrowLeftRight,
  FlaskConical,
  Users,
} from "lucide-react";
import bgImage from "../images/lovely-easter-white-lily-blooms-2jfhx5wifsoflo3j.jpg";

export default function DefaultLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ perfumes: any[], brands: any[], reviews: any[] } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const [modalPerfumesOpen, setModalPerfumesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setIsSearchOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const query = searchQuery.trim().toLowerCase();
        
        // Fetch perfumes with query
        const perfumesRes = await fetch(`http://localhost:3000/api/perfumes?q=${encodeURIComponent(query)}`);
        const perfumesData = perfumesRes.ok ? await perfumesRes.json() : [];
        
        // Fetch brands
        const brandsRes = await fetch(`http://localhost:3000/api/brands`);
        let brandsData = brandsRes.ok ? await brandsRes.json() : [];
        brandsData = brandsData.filter((b: any) => b.name.toLowerCase().includes(query)).slice(0, 8);
        
        // Fetch reviews
        const reviewsRes = await fetch(`http://localhost:3000/api/reviews`);
        let reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];
        reviewsData = reviewsData.filter((r: any) => r.perfumeName && r.perfumeName.toLowerCase().includes(query)).slice(0, 8);

        setSearchResults({
          perfumes: perfumesData.slice(0, 8),
          brands: brandsData,
          reviews: reviewsData
        });
        setIsSearchOpen(true);
      } catch (err) {
        console.error("Erro na busca:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay branco semitransparente em todo o fundo */}
      <div className="absolute inset-0 bg-white/60 pointer-events-none"></div>

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">FH</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                FragranceHub
              </span>
            </Link>
            <div className="flex">
              <div
                className="group/dropdown relative"
                onMouseEnter={() => setModalPerfumesOpen(true)}
                onMouseLeave={() => setModalPerfumesOpen(false)}
              >
                <Button className="hidden md:flex bg-transparent hover:bg-transparent text-gray-700 gap-2">
                  Perfumes
                  {modalPerfumesOpen === true ? (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  ) : modalPerfumesOpen === false ? (
                    <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-200" />
                  ) : null}
                </Button>
                <div className="absolute top-full z-10 w-screen max-w-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {modalPerfumesOpen && (
                    <div className="relative rounded-md shadow-2xl ring-1 ring-zinc-900/[0.08] dark:ring-zinc-700/50 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl overflow-hidden">
                      <div className="flex flex-col py-8 px-10 gap-10 ">
                        <button
                          onClick={() => {
                            setModalPerfumesOpen(false);
                            navigate("/busca");
                          }}
                          className="flex items-center gap-4 hover:text-teal-600 transition-colors duration-200"
                        >
                          <Search className="w-6 h-6 inline-block mr-1" />
                          Ver todos os perfumes
                        </button>
                        <button
                          onClick={() => {
                            setModalPerfumesOpen(false);
                            navigate("/marcas");
                          }}
                          className="flex items-center gap-4 hover:text-teal-600 transition-colors duration-200 "
                        >
                          <Tag className="w-6 h-6 inline-block mr-1" />
                          Designers
                        </button>
                        <button
                          onClick={() => {
                            setModalPerfumesOpen(false);
                            navigate("/comparar");
                          }}
                          className="flex items-center gap-4 hover:text-teal-600 transition-colors duration-200 "
                        >
                          <ArrowLeftRight className="w-6 h-6 inline-block mr-1" />
                          <span className="font-semibold text-md">
                            Comparar Fragrâncias
                          </span>
                        </button>
                        <button
                          className="flex items-center gap-4 hover:text-teal-600 transition-colors duration-200 "
                          onClick={() => {
                            setModalPerfumesOpen(false);
                            navigate("/busca-notas");
                          }}
                        >
                          <FlaskConical className="w-6 h-6 inline-block mr-1" />
                          Buscar por Notas
                        </button>
                        <button
                          onClick={() => {
                            setModalPerfumesOpen(false);
                            navigate("/grupos");
                          }}
                          className="flex items-center gap-4 hover:text-teal-600 transition-colors duration-200"
                        >
                          <Users className="w-6 h-6 inline-block mr-1" />
                          <span className="font-semibold text-md">
                            Grupo de Perfumes
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => navigate("/notas")}
                className="hidden md:flex bg-transparent hover:bg-transparent text-gray-700 "
              >
                Notas
              </Button>

              <Button
                onClick={() => navigate("/perfumistas")}
                className="hidden md:flex bg-transparent hover:bg-transparent text-gray-700 "
              >
                Perfumistas
              </Button>
              <Button
                onClick={() => navigate("/resenhas")}
                className="hidden md:flex bg-transparent hover:bg-transparent text-gray-700 "
              >
                Resenhas
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Tabs defaultValue="Sun">
                <TabsList className="bg-transparent border-b-2 border-gray-200">
                  <TabsTrigger
                    value="Sun"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    ☀️
                  </TabsTrigger>
                  <TabsTrigger
                    value="Moon"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    🌙
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button className="rounded-full bg-gray-200 text-black hover:bg-gray-200">
                <SearchIcon className="w-5 h-5" />
              </Button>
              {currentUser ? (
                <div className="relative">
                  <Button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    variant="outline"
                    className="gap-2 cursor-pointer relative z-50"
                  >
                    <User className="w-4 h-4" />
                    {currentUser.name}
                  </Button>

                  {isUserMenuOpen && (
                    <>
                      {/* Fundo invisível para fechar ao clicar fora */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>

                      {/* Menu */}
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-lg z-50 flex flex-col py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>

                        {/* Meu Perfil */}
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate("/perfil");
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            id="profile-menu-btn"
                          >
                            Meu Perfil
                          </button>

                        {isAdmin() && (
                          <div className="border-b border-gray-100">
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                navigate("/admin");
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Painel Admin
                            </button>
                          </div>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button onClick={() => navigate("/login")}>Login</Button>
              )}
            </div>
          </div>
          <div className="relative flex-1 max-w-4xl mt-4">
            <form
              onSubmit={handleSearch}
              className="border border-gray-300 rounded-md bg-white"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 " />
                <Input
                  type="search"
                  placeholder="Buscar perfumes, marcas, perfumistas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim()) setIsSearchOpen(true); }}
                  className="pl-10 pr-4 py-2 w-full border-none focus-visible:ring-0 bg-transparent"
                />
              </div>
            </form>

            {isSearchOpen && searchResults && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSearchOpen(false)}
                ></div>
                
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-6 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Coluna 1: Perfumes */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Perfumes</h3>
                      {searchResults.perfumes.length > 0 ? (
                        <div className="space-y-3">
                          {searchResults.perfumes.map((p: any) => (
                            <Link 
                              key={p.id} 
                              to={`/perfume/${p.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                            >
                              {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 object-contain mix-blend-multiply" />}
                              <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">{p.brand?.name}</p>
                                <p className="text-sm font-bold text-teal-700 group-hover:text-teal-600">{p.name}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhum perfume encontrado</p>
                      )}
                    </div>

                    {/* Coluna 2: Marcas */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Marcas</h3>
                      {searchResults.brands.length > 0 ? (
                        <div className="space-y-3">
                          {searchResults.brands.map((b: any) => (
                            <Link 
                              key={b.id} 
                              to={`/marcas`} 
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                            >
                              {b.image ? (
                                <img src={b.image} alt={b.name} className="w-10 h-10 object-contain mix-blend-multiply" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs font-bold">{b.name.charAt(0)}</span>
                                </div>
                              )}
                              <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{b.name}</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma marca encontrada</p>
                      )}
                    </div>

                    {/* Coluna 3: Resenhas */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Resenhas</h3>
                      {searchResults.reviews.length > 0 ? (
                        <div className="space-y-3">
                          {searchResults.reviews.map((r: any) => (
                            <Link 
                              key={r.id} 
                              to={`/perfume/${r.perfumeId}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                            >
                              {r.perfumeImage && <img src={r.perfumeImage} alt={r.perfumeName} className="w-10 h-10 object-contain mix-blend-multiply flex-shrink-0" />}
                              <div>
                                <p className="text-xs font-bold text-gray-900">{r.userName}</p>
                                <p className="text-xs text-teal-600 line-clamp-1 group-hover:text-teal-700 mt-0.5">
                                  Resenha sobre <span className="font-semibold">{r.perfumeName}</span>
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma resenha encontrada</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Aqui vão as páginas que usam esse layout (Outlet do react-router) */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
