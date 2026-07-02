import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";

export default function SidebarResenhasPerfumes() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: { perfumes: 0, brands: 0, perfumists: 0, reviews: 0 },
    recentReviews: [] as any[]
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        if (data.stats) setDashboardData(data);
      })
      .catch(err => console.error("Erro ao buscar dados do sidebar:", err));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Enciclopédia de Perfumes */}
      <Card className="bg-background/90 backdrop-blur-sm rounded-xl shadow-sm border border-border p-6">
        <p className="text-lg font-bold text-foreground mb-1">
          Enciclopédia de Perfumes
        </p>
        <div className="h-0.5 w-full bg-muted rounded-full mb-5">
          <div className="h-full w-12 bg-gray-800 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <p
              onClick={() => navigate("/busca")}
              className="hover:text-primary cursor-pointer"
            >
              Perfumes
            </p>
            <p className="font-bold text-foreground">{dashboardData.stats.perfumes}</p>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-2">
            <p
              onClick={() => navigate("/perfumistas")}
              className="hover:text-primary cursor-pointer"
            >
              Perfumistas
            </p>
            <p className="font-bold text-foreground">{dashboardData.stats.perfumists}</p>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-2">
            <p
              onClick={() => navigate("/resenhas")}
              className="hover:text-primary cursor-pointer">Resenhas</p>
            <p className="font-bold text-foreground">{dashboardData.stats.reviews}</p>
          </div>
          <div className="flex justify-between items-center">
            <p
              onClick={() => navigate("/marcas")}
              className="hover:text-primary cursor-pointer"
            >
              Marcas
            </p>
            <p className="font-bold text-foreground">{dashboardData.stats.brands}</p>
          </div>
        </div>
      </Card>

      {/* Resenhas Mais Recentes */}
      <Card className="bg-background/90 backdrop-blur-sm rounded-xl shadow-sm border border-border p-6">
        <p className="text-lg font-bold text-foreground mb-1">
          Resenhas Mais Recentes
        </p>
        <div className="h-0.5 w-full bg-muted rounded-full mb-5">
          <div className="h-full w-12 bg-gray-800 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-4">
          {dashboardData.recentReviews.map((review: any) => (
            <div
              key={review.id}
              onClick={() => navigate(`/resenha/${review.id}`)}
              className="flex items-center gap-4 group cursor-pointer border-b border-border pb-4 last:border-0 last:pb-0 hover:bg-teal-100 p-2 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-muted/50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                {review.perfumeImage ? (
                  <img src={review.perfumeImage} alt={review.perfumeName} className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="w-full h-full bg-teal-100 rounded text-teal-800 font-bold flex items-center justify-center text-xl">
                    {review.perfumeName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary truncate">
                  {review.perfumeName}
                </p>
                <p className="text-xs text-primary/80 line-clamp-1">{review.comment}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    por {review.userName}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-muted overflow-hidden flex items-center justify-center text-[8px] bg-teal-200 text-teal-800">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {dashboardData.recentReviews.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma resenha encontrada.</p>
          )}
        </div>
      </Card>
    </div>
  )
}