import { useState, useMemo, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router";
import SidebarResenhasPerfumes from "../components/SidebarResenhasPerfumes";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const BASE_FAMILIES = [
  { id: 'citrus', name: 'Cítricos', icon: '🍋', color: '#eab308', bgColor: '#fef08a', description: 'Frescos e energizantes', notes: ['Bergamota', 'Limão', 'Toranja', 'Mandarina', 'Tangerina', 'Laranja', 'Grapefruit', 'Cidra', 'Limão Siciliano', 'Bérga'] },
  { id: 'fruits', name: 'Frutas', icon: '🍒', color: '#ef4444', bgColor: '#fecaca', description: 'Doces e suculentas', notes: ['Maçã', 'Pera', 'Frutas Vermelhas', 'Côco', 'Maçã Verde'] },
  { id: 'flowers', name: 'Flores', icon: '🌸', color: '#ec4899', bgColor: '#fbcfe8', description: 'Delicadas e românticas', notes: ['Rosa', 'Jasmim', 'Lavanda', 'Lírio', 'Flor de Laranjeira', 'Orquídea', 'Peônia', 'Tuberosa', 'Ylang-ylang', 'Gerânio', 'Gardênia', 'Acórdão de Flores', 'Madressilva'] },
  { id: 'woods', name: 'Madeiras', icon: '🪵', color: '#8b5cf6', bgColor: '#ddd6fe', description: 'Secas e elegantes', notes: ['Cedro', 'Sândalo', 'Vetiver', 'Patchouli', 'Madeira de Agar', 'Oud', 'Palisandro', 'Madeira de Cedro'] },
  { id: 'spices', name: 'Especiarias', icon: '🌶️', color: '#f97316', bgColor: '#ffedd5', description: 'Picantes e exóticas', notes: ['Canela', 'Cardamomo', 'Noz-moscada', 'Pimenta', 'Gengibre', 'Cravo', 'Anis', 'Pimenta-rosa', 'Alecrim', 'Sálvia', 'Especiarias'] },
  { id: 'resins', name: 'Resinas & Doces', icon: '🍯', color: '#d97706', bgColor: '#fde68a', description: 'Quentes e envolventes', notes: ['Âmbar', 'Baunilha', 'Incenso', 'Fava Tonka', 'Tonka', 'Baunilha Tahitiana', 'Café', 'Amêndoa', 'Sangue de Dragão'] },
  { id: 'earthy', name: 'Terrosos & Verdes', icon: '🌿', color: '#22c55e', bgColor: '#bbf7d0', description: 'Frescos e naturais', notes: ['Musgo', 'Musgo de Carvalho', 'Hortelã', 'Eucalipto', 'Cipreste'] },
  { id: 'musk', name: 'Almíscares', icon: '🐾', color: '#64748b', bgColor: '#e2e8f0', description: 'Sensuais e pele', notes: ['Almíscar', 'Couro', 'Âmbar Cinzento', 'Lã', 'Cashmere'] },
  { id: 'aquatic', name: 'Aquáticos', icon: '💧', color: '#06b6d4', bgColor: '#cffafe', description: 'Marinhos e salgados', notes: ['Aquático', 'Sal Marinho'] },
];

const NoteCard = ({ note, family }: { note: string, family: any }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    fetch(`http://localhost:3000/api/notes/image?name=${encodeURIComponent(note)}`)
      .then(res => res.json())
      .then(data => {
        setImageUrl(data.imageUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isVisible, note]);

  return (
    <Link 
      ref={cardRef}
      to={`/nota/${encodeURIComponent(note)}`} 
      state={{ noteName: note, groupName: family.name }}
      className="group flex flex-col items-center p-4 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer text-center h-full"
    >
      <div 
        className="w-20 h-20 rounded-full mb-3 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300 overflow-hidden relative"
        style={{ backgroundColor: family.bgColor, color: family.color }}
      >
        {loading && isVisible ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-teal-500 rounded-full animate-spin"></div>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={note} className="w-full h-full object-cover" />
        ) : (
          family.icon
        )}
      </div>
      <span className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
        {note}
      </span>
    </Link>
  );
};

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [perfumes, setPerfumes] = useState<any[]>([]);

    useEffect(() => {
      fetch("http://localhost:3000/api/perfumes")
        .then((res) => res.json())
        .then((data) => setPerfumes(data))
        .catch((err) => {
          console.error(err);
          toast.error("Erro ao carregar notas dos perfumes.");
        });
    }, []);

    const noteFamilies = useMemo(() => {
      const families = [...BASE_FAMILIES];
      const assignedNotes = new Set(families.flatMap(f => f.notes));
      const allExistingNotes = new Set<string>();
      
      perfumes.forEach(p => {
        [...(p.topNotes || []), ...(p.heartNotes || []), ...(p.baseNotes || [])].forEach(n => allExistingNotes.add(n));
      });

      const unassigned = Array.from(allExistingNotes).filter(n => !assignedNotes.has(n));
      
      if (unassigned.length > 0) {
        families.push({
          id: 'other',
          name: 'Outros',
          icon: '✨',
          color: '#71717a',
          bgColor: '#e4e4e7',
          description: 'Notas diversas e aromáticos sintéticos',
          notes: unassigned.sort()
        });
      }

      return families;
    }, [perfumes]);

    const filteredFamilies = useMemo(() => {
        if (!searchQuery.trim()) return noteFamilies;
        
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const lowerQuery = normalizeString(searchQuery);
        
        return noteFamilies.map(family => {
            const matchesFamily = normalizeString(family.name).includes(lowerQuery);
            if (matchesFamily) return family;
            
            const matchingNotes = family.notes.filter(n => normalizeString(n).includes(lowerQuery));
            if (matchingNotes.length > 0) {
                return { ...family, notes: matchingNotes };
            }
            return null;
        }).filter(Boolean) as typeof BASE_FAMILIES;
    }, [searchQuery, noteFamilies]);

    return (
        <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-background/40 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-6 flex justify-center">Notas Olfativas</h1>
                        
                        <div className="relative max-w-md mx-auto w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                type="search"
                                placeholder="Buscar notas ou grupos (ex: Rosa, Cítricos)..."
                                className="pl-12 pr-4 py-3 h-12 w-full text-base rounded-full shadow-sm border-border focus:border-primary focus:ring-primary bg-background transition-shadow focus:shadow-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Family Navigation Anchors (Only show if no search) */}
                    {!searchQuery && (
                        <div className="mb-10 pb-4 border-b border-border overflow-x-auto hide-scrollbar">
                            <div className="flex gap-2 min-w-max px-2">
                                {noteFamilies.map(family => (
                                    <a 
                                        key={`nav-${family.id}`} 
                                        href={`#family-${family.id}`}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
                                        style={{ backgroundColor: family.bgColor, color: family.color }}
                                    >
                                        <span className="text-lg">{family.icon}</span>
                                        {family.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes by Family */}
                    <div className="space-y-12">
                        {filteredFamilies.length > 0 ? (
                            filteredFamilies.map(family => (
                                <section key={family.id} id={`family-${family.id}`} className="scroll-mt-28">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight flex items-center gap-2">
                                            <span className="text-3xl" style={{ color: family.color }}>{family.icon}</span>
                                            {family.name}
                                        </h2>
                                    </div>
                                    <p className="text-muted-foreground mb-6 ml-11">{family.description}</p>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {family.notes.map(note => (
                                            <NoteCard key={note} note={note} family={family} />
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-background/60 rounded-3xl border border-dashed border-border">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-1">Nenhuma nota encontrada</h3>
                                <p className="text-muted-foreground">Tente buscar por um termo diferente.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <SidebarResenhasPerfumes />
                </div>
            </div>
        </main>
    );
}