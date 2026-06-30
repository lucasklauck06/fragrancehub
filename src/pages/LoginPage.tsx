import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    const result = isSignup
      ? await signup(name, email, password)
      : await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erro ao processar solicitação');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-zinc-950 p-4 relative">
      <div className="absolute top-4 right-4">
        <Tabs 
          value={theme === 'dark' ? 'Moon' : 'Sun'} 
          onValueChange={(val) => setTheme(val === 'Moon' ? 'dark' : 'light')}
        >
          <TabsList className="bg-transparent border-b-2 border-border dark:border-zinc-700">
            <TabsTrigger
              value="Sun"
              className="text-muted-foreground hover:text-foreground"
            >
              ☀️
            </TabsTrigger>
            <TabsTrigger
              value="Moon"
              className="text-muted-foreground hover:text-foreground"
            >
              🌙
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">FH</span>
            </div>
          </div>
          <CardTitle className="text-2xl">FragranceHub</CardTitle>
          <CardDescription>
            {isSignup ? 'Crie sua conta' : 'Entre na sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {isSignup ? 'Cadastrar' : 'Entrar'}
            </Button>

            <div className="text-center text-sm">
              {isSignup ? (
                <>
                  Já tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(false);
                      setError('');
                    }}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Entre aqui
                  </button>
                </>
              ) : (
                <>
                  Não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(true);
                      setError('');
                    }}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Cadastre-se
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
