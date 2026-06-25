import { History, UserCircle, Snowflake, Leaf, Umbrella, CloudRain, Sun, Moon, Star } from 'lucide-react';

interface SliderProps {
  value: number;
  onChange: (val: number) => void;
}

export const LongevitySlider = ({ value, onChange }: SliderProps) => {
  const labels = ["sem voto", "muito fraca", "fraca", "moderada", "longa", "eterna"];
  
  return (
    <div className="flex flex-col items-center w-full py-4 mt-2">
      <History className="w-8 h-8 text-slate-500 mb-1" />
      <span className="text-xs font-bold text-slate-600 tracking-wider mb-8 uppercase">Longevidade</span>
      
      <div className="relative w-[calc(100%-2rem)] max-w-sm flex items-center h-1.5 bg-gray-200 rounded-full mt-2">
        {/* Fill bar */}
        <div 
          className="absolute h-full bg-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
        
        {/* Points */}
        {[0, 1, 2, 3, 4, 5].map(step => (
          <div 
            key={step} 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
            style={{ left: `${(step / 5) * 100}%` }}
            onClick={() => onChange(step)}
          >
            {step === 0 ? (
              <div className={`w-4 h-4 rounded-full bg-white border-2 z-10 transition-colors ${value >= 0 ? "border-teal-500" : "border-gray-300"}`} />
            ) : (
              <div className={`w-2.5 h-2.5 rounded-full z-10 transition-colors ${value >= step ? "bg-teal-500" : "bg-teal-200"}`} />
            )}
            
            {/* Label */}
            <span className={`absolute -top-7 whitespace-nowrap text-[10px] transition-opacity ${value === step ? 'opacity-100 font-bold text-teal-700' : 'opacity-0 group-hover:opacity-100 text-gray-400'}`}>
              {labels[step]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SillageSlider = ({ value, onChange }: SliderProps) => {
  const labels = ["sem voto", "íntimo", "suave", "moderado", "forte", "enorme"];
  
  return (
    <div className="flex flex-col items-center w-full py-4 mt-2">
      <UserCircle className="w-8 h-8 text-slate-500 mb-1" />
      <span className="text-xs font-bold text-slate-600 tracking-wider mb-8 uppercase">Rastro</span>
      
      <div className="relative w-[calc(100%-2rem)] max-w-sm flex items-center h-1.5 bg-gray-200 rounded-full mt-2">
        <div 
          className="absolute h-full bg-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
        
        {[0, 1, 2, 3, 4, 5].map(step => (
          <div 
            key={step} 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
            style={{ left: `${(step / 5) * 100}%` }}
            onClick={() => onChange(step)}
          >
            {step === 0 ? (
              <div className={`w-4 h-4 rounded-full bg-white border-2 z-10 transition-colors ${value >= 0 ? "border-purple-500" : "border-gray-300"}`} />
            ) : (
              <div className={`w-2.5 h-2.5 rounded-full z-10 transition-colors ${value >= step ? "bg-purple-500" : "bg-purple-200"}`} />
            )}
            
            <span className={`absolute -top-7 whitespace-nowrap text-[10px] transition-opacity ${value === step ? 'opacity-100 font-bold text-purple-700' : 'opacity-0 group-hover:opacity-100 text-gray-400'}`}>
              {labels[step]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OccasionSelector = ({ selected, onChange }: { selected: string, onChange: (val: string) => void }) => {
  const occasions = [
    { id: "Inverno", icon: Snowflake, color: "text-blue-500" },
    { id: "Primavera", icon: Leaf, color: "text-green-500" },
    { id: "Verão", icon: Umbrella, color: "text-red-500" },
    { id: "Outono", icon: CloudRain, color: "text-orange-500" },
    { id: "Dia", icon: Sun, color: "text-yellow-500" },
    { id: "Noite", icon: Moon, color: "text-sky-300" },
    { id: "Assinatura", icon: Star, color: "text-amber-500" },
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-6 py-2">
      {occasions.map(occ => {
        const Icon = occ.icon;
        const isSingleActive = selected === occ.id;
        
        return (
          <div 
            key={occ.id} 
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
            onClick={() => onChange(occ.id)}
          >
            <Icon className={`w-8 h-8 transition-colors ${isSingleActive ? occ.color : 'text-gray-300 group-hover:text-gray-400'}`} />
            <span className={`text-[11px] font-bold transition-colors ${isSingleActive ? occ.color : 'text-gray-400'}`}>
              {occ.id}
            </span>
          </div>
        );
      })}
    </div>
  );
};
