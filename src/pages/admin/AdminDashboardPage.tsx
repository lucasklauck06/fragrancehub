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
      link: '/admin/perfumes',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral do sistema FragranceHub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
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

        <Card>
          <CardHeader>
            <CardTitle>Últimas Resenhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData.recentReviews.map((review: any) => {
                return (
                  <div key={review.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-semibold text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{review.userName}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {review.perfumeName} - {review.rating} estrelas
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
