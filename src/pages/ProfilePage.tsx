import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  User,
  Mail,
  Lock,
  Save,
  Star,
  Clock,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api";

interface MyReview {
  id: string;
  rating: number;
  comment: string;
  longevidade?: number | null;
  rastro?: number | null;
  quandoUsar?: string | null;
  date: string;
  perfume: { id: string; name: string; image: string };
}

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [saving, setSaving] = useState(false);

  // Recent reviews
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchMyReviews();
  }, [currentUser]);

  const fetchMyReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Erro ao carregar resenhas:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Nome e e-mail são obrigatórios.");
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error("As novas senhas não coincidem.");
      return;
    }

    if (newPassword && !currentPassword) {
      toast.error("Informe sua senha atual para alterá-la.");
      return;
    }

    setSaving(true);
    const payload: any = { name, email };
    if (newPassword) {
      payload.password = newPassword;
      payload.currentPassword = currentPassword;
    }

    const result = await updateProfile(payload);
    if (result.success) {
      toast.success("Perfil atualizado com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      toast.error(result.error || "Erro ao atualizar perfil.");
    }
    setSaving(false);
  };

  if (!currentUser) return null;

  const StarRow = ({ value, label }: { value: number | null | undefined; label: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">{label}:</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((v) => (
            <Star
              key={v}
              className={`w-3 h-3 ${v <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="relative flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm text-gray-500">{currentUser.email}</span>
              {currentUser.role === "ADMIN" && (
                <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Formulário de Edição ────────────────────────────── */}
        <div className="space-y-4">
          <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Dados Cadastrais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSaveProfile} className="space-y-4" id="profile-form">
                {/* Nome */}
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    Nome Completo
                  </Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="profile-email" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    E-mail
                  </Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                {/* Divisor senha */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Alterar Senha (opcional)
                  </p>

                  <div className="space-y-3">
                    {/* Senha atual */}
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password" className="text-sm font-semibold text-gray-700">
                        Senha Atual
                      </Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPwd ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Nova senha */}
                    <div className="space-y-1.5">
                      <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                        Nova Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPwd ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPwd(!showNewPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar nova senha */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-new-password" className="text-sm font-semibold text-gray-700">
                        Confirmar Nova Senha
                      </Label>
                      <Input
                        id="confirm-new-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 gap-2 mt-2"
                  disabled={saving}
                  id="save-profile-btn"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ── Resenhas Recentes ──────────────────────────────── */}
        <div>
          <Card className="border border-gray-100 bg-white/95 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Minhas Resenhas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {loadingReviews ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
                </div>
              ) : myReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Você ainda não publicou resenhas.</p>
                  <Link
                    to="/busca"
                    className="text-sm text-teal-600 font-semibold hover:underline mt-1 block"
                  >
                    Explorar perfumes →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReviews.map((review) => (
                    <Link
                      key={review.id}
                      to={`/resenha/${review.id}`}
                      className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200 group"
                    >
                      <img
                        src={review.perfume.image}
                        alt={review.perfume.name}
                        className="w-12 h-16 object-cover rounded bg-gray-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{review.perfume.name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <Star
                              key={v}
                              className={`w-3 h-3 ${v <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                            />
                          ))}
                        </div>
                        <div className="mt-1 space-y-0.5">
                          <StarRow value={review.longevidade} label="Fixação" />
                          <StarRow value={review.rastro} label="Rastro" />
                          {review.quandoUsar && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500">Ocasião:</span>
                              <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{review.quandoUsar}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{review.comment}</p>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          {new Date(review.date).toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0 self-center" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
