import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { Button } from "./ui/button";

export default function BottomBrandsParfums() {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/perfumes")
      .then((res) => res.json())
      .then((data) => setPerfumes(data))
      .catch((err) => console.error("Erro ao buscar perfumes:", err));

    fetch("http://localhost:3000/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Erro ao buscar marcas:", err));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-background backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col">
        <h2 className="text-2xl flex justify-center font-bold mb-10 ">
          Alguns Perfumes
        </h2>
        <div className="flex grid grid-cols-4 gap-4">
          {perfumes.slice(0, 22).map((perfume, index) => {
            const displayText = `${perfume.name}`;
            return (
              <div key={perfume.id} className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {index + 1}.
                </span>
                <span
                  onClick={() => navigate(`/perfume/${perfume.id}`)}
                  className="cursor-pointer text-lg font-bold text-foreground hover:text-primary transition-colors duration-200"
                  title={displayText}
                >
                  {displayText.length > 15
                    ? displayText.substring(0, 15) + "..."
                    : displayText}
                </span>
                <span
                  className="cursor-pointer text-md hover:text-primary text-muted-foreground transition-colors duration-200"
                  onClick={() => navigate(`/marca/${perfume.brandId}`)}
                >
                  {perfume.brand}
                </span>
              </div>
            );
          })}
        </div>
        <h2 className="mt-10 text-2xl flex justify-center font-bold mb-4">
          Algumas Marcas
        </h2>
        <div className="flex grid grid-cols-6 gap-4">
          {brands.map((brand, index) => {
            const displayText = `${brand.name}`;
            return (
              <div key={brand.id} className="flex items-center">
                <span className="text-lg font-bold text-foreground">
                  {index + 1}.
                </span>
                <span
                  className="cursor-pointer text-lg font-bold text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => navigate(`/marca/${brand.id}`)}
                  title={displayText}
                >
                  {displayText.length > 15
                    ? displayText.substring(0, 15) + "..."
                    : displayText}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-10 bg-transparent text-foreground border border-foreground hover:bg-transparent hover:text-primary hover:border-primary p-2 rounded-lg w-fit"
          >
            Voltar ao Topo
          </Button>
        </div>
      </div>
    </div>
  );
}
