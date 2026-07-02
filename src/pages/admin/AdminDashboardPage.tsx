import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Droplet, Building2, User, Users, MessageSquare } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState({
    stats: { perfumes: 0, brands: 0, perfumists: 0, users: 0, reviews: 0 },
    recentReviews: [] as any[]
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStatsData(data);
        }
      })
      .catch(err => console.error("Error fetching dashboard stats:", err));
  }, []);

  const stats = [
    {
      title: 'Perfumes',
      value: statsData.stats.perfumes,
      icon: Droplet,
      color: 'purple',
      link: '/admin/perfumes',
    },
    {
      title: 'Marcas',
      value: statsData.stats.brands,
      icon: Building2,
      color: 'blue',
      link: '/admin/marcas',
    },
    {
      title: 'Perfumistas',
      value: statsData.stats.perfumists,
      icon: User,
      color: 'pink',
      link: '/admin/perfumistas',
    },
    {
      title: 'Usuários',
      value: statsData.stats.users,
      icon: Users,
      color: 'green',
      link: '/admin/usuarios',
    },
    {
      title: 'Resenhas',
      value: statsData.stats.reviews,
      icon: MessageSquare,
      color: 'orange',
      link: '/admin/resenhas',
    },
  ];

  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    pink: 'bg-pink-100 text-pink-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema FragranceHub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <CardTitle className="text-xl">Últimas Resenhas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {statsData.recentReviews.map((review: any) => {
                const dateObj = new Date(review.date);
                const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
                return (
                  <div key={review.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center border border-orange-300 shadow-sm">
                      <span className="text-orange-700 font-bold text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground truncate">{review.userName}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted px-2 py-0.5 rounded-full">{formattedDate}</span>
                      </div>
                      <p className="text-sm text-primary font-medium truncate">
                        {review.perfumeName}
                      </p>
                      <div className="flex items-center mt-1 mb-2">
                        <div className="flex gap-0.5 mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-1.5 rounded">{review.rating}.0</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 italic border-l-2 border-orange-200 pl-3 py-0.5">
                        "{review.comment}"
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto text-right">
                      <Link to={`/resenha/${review.id}`} className="inline-flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors border border-orange-200 w-full sm:w-auto">
                        Ver detalhes
                        <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
              {statsData.recentReviews.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma resenha recente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
