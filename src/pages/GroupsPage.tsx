import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { X, Sun, Snowflake, Leaf, Flame, ChevronRight } from 'lucide-react';
import { toast } from "sonner";

// Tailwind Safelist para os gradients dinâmicos vindos do banco
const bgGradients = [
  "from-yellow-700", "to-amber-800",
  "from-emerald-400", "to-teal-500",
  "from-stone-400", "to-stone-600",
  "from-pink-300", "to-rose-400",
  "from-violet-400", "to-purple-500",
  "from-sky-300", "to-cyan-400",
  "from-yellow-500", "to-amber-600",
  "from-amber-400", "to-orange-500",
  "bg-gradient-to-br"
];

export type AromaticGroup = {
  id: string;
  name: string;
  color: string;
  gradient: string;
  textColor: string;
  icon: string;
  gender: string;
  description: string;
  seasonality: string[];
  characteristics: string[];
  subGroups: string[];
  representativePerfumes: string[];
  perfumes?: any[];
};

const seasonIcon: Record<string, React.ReactNode> = {
  Primavera: <Leaf className="w-3.5 h-3.5 text-green-500" />,
  Verão:     <Sun className="w-3.5 h-3.5 text-yellow-500" />,
  Outono:    <Flame className="w-3.5 h-3.5 text-orange-500" />,
  Inverno:   <Snowflake className="w-3.5 h-3.5 text-blue-400" />,
  'Ano todo': <span className="text-xs">🔄</span>,
};

function GroupCard({ group, onClick }: { group: AromaticGroup; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:shadow-xl hover:scale-[1.02] active:scale-100 bg-gradient-to-br ${group.gradient} group cursor-pointer`}
    >
      {/* Decorative circle */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20"
        style={{ backgroundColor: '#fff' }}
      />
      <div
        className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: '#fff' }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{group.icon}</span>
          <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" style={{ color: group.textColor }} />
        </div>
        <h3 className="font-black text-xl mb-1" style={{ color: group.textColor }}>
          {group.name}
        </h3>
        <p className="text-sm opacity-80 line-clamp-2 mb-3" style={{ color: group.textColor }}>
          {group.description}
        </p>

        {/* Characteristics */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(group.characteristics || []).map(c => (
            <span
              key={c}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: group.textColor }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Season & gender footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(group.seasonality || []).slice(0, 2).map(s => (
              <div key={s} className="flex items-center gap-0.5">
                {seasonIcon[s]}
              </div>
            ))}
          </div>
          <span
            className="text-xs font-medium opacity-80"
            style={{ color: group.textColor }}
          >
            {(group.subGroups || []).length} sub-grupos
          </span>
        </div>
      </div>
    </button>
  );
}

import { createPortal } from 'react-dom';

function GroupModal({ group, onClose }: { group: AromaticGroup; onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className={`bg-gradient-to-br ${group.gradient} p-6 rounded-t-3xl relative overflow-hidden`}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-background/10" />
          <div className="absolute -right-2 bottom-0 w-20 h-20 rounded-full bg-background/5" />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="text-5xl mb-2 block">{group.icon}</span>
              <h2 className="font-black text-2xl" style={{ color: group.textColor }}>{group.name}</h2>
              <p className="text-sm opacity-80 mt-1" style={{ color: group.textColor }}>{group.gender}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors cursor-pointer"
              style={{ color: group.textColor }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Sobre</h3>
            <p className="text-muted-foreground leading-relaxed">{group.description}</p>
          </div>

          {/* Characteristics */}
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Características</h3>
            <div className="flex flex-wrap gap-2">
              {(group.characteristics || []).map(c => (
                <span key={c} className="bg-muted text-muted-foreground text-sm px-3 py-1.5 rounded-full font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Sub-groups */}
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Sub-grupos</h3>
            <div className="grid grid-cols-2 gap-2">
              {(group.subGroups || []).map(sg => (
                <div key={sg} className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-xl border border-border">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                  <span className="text-sm text-muted-foreground">{sg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonality */}
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Estações Ideais</h3>
            <div className="flex flex-wrap gap-2">
              {(group.seasonality || []).map(s => (
                <div key={s} className="flex items-center gap-1.5 bg-muted/50 border border-border px-3 py-1.5 rounded-full text-sm text-muted-foreground">
                  {seasonIcon[s]}
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Representative perfumes */}
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Perfumes deste Grupo</h3>
            <div className="space-y-2">
              {group.perfumes && group.perfumes.length > 0 ? (
                group.perfumes.map((perfume: any) => (
                  <Link 
                    key={perfume.id} 
                    to={`/perfume/${perfume.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border hover:border-primary/50 hover:bg-background transition-all cursor-pointer group/perfume"
                  >
                    <img 
                      src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop"} 
                      alt={perfume.name}
                      className="w-10 h-10 rounded-md object-cover shadow-sm bg-background"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover/perfume:text-primary transition-colors">{perfume.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">{perfume.brand?.name || 'Marca'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/perfume:text-primary" />
                  </Link>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic p-2 bg-muted/50 rounded-lg text-center">Nenhum perfume cadastrado neste grupo ainda.</div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link
              to={`/busca?grupo=${group.id}`}
              onClick={onClose}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${group.gradient} hover:opacity-90 transition-opacity`}
            >
              Ver perfumes deste grupo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function GroupsPage() {
  const [aromaticGroups, setAromaticGroups] = useState<AromaticGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<AromaticGroup | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/aromatic-groups")
      .then((res) => res.json())
      .then((data) => setAromaticGroups(data))
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar grupos aromáticos.");
      });
  }, []);

  return (
    <>
    <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-background/40  backdrop-blur-sm rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Intro card */}
        <div className="bg-background rounded-2xl border border-border p-5 mb-8 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🌐</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground mb-1">O que são grupos aromáticos?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As famílias olfativas são categorias que classificam fragrâncias de acordo com suas características predominantes.
              Criadas pela indústria perfumísta para facilitar a comunicação entre criadores, varejistas e consumidores.
              Conhecer os grupos ajuda você a encontrar perfumes com maior precisão.
            </p>
          </div>
        </div>

        {/* Groups grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {aromaticGroups.map(group => (
            <GroupCard key={group.id} group={group} onClick={() => setActiveGroup(group)} />
          ))}
          {aromaticGroups.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhum grupo aromático encontrado ou carregando...
            </div>
          )}
        </div>

        {/* Fragrance Family Quick Reference */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/50">
            <h3 className="font-bold text-foreground">Referência Rápida — Famílias Olfativas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Sub-grupos de cada família</p>
          </div>
          <div className="divide-y divide-gray-100">
            {aromaticGroups.map(group => (
              <div key={group.id} className="px-5 py-4 flex items-start gap-4">
                <div className="flex items-center gap-2 w-36 flex-shrink-0">
                  <span className="text-xl">{group.icon}</span>
                  <button
                    onClick={() => setActiveGroup(group)}
                    className="font-bold text-sm text-foreground hover:text-purple-600 transition-colors text-left cursor-pointer"
                  >
                    {group.name}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {(group.subGroups || []).map(sg => (
                    <span
                      key={sg}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{
                        backgroundColor: `${group.color}20`,
                        color: group.id === 'woody' || group.id === 'leather' ? '#44403c' : group.textColor,
                        borderColor: `${group.color}50`,
                      }}
                    >
                      {sg}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {(group.seasonality || []).map(s => (
                    <span key={s} className="flex items-center" title={s}>
                      {seasonIcon[s]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Predominantemente Feminino', groups: aromaticGroups.filter(g => g.gender && g.gender.includes('Feminino')), color: '#fce7f3', text: '#be185d', icon: '🌸' },
            { label: 'Predominantemente Masculino', groups: aromaticGroups.filter(g => g.gender && g.gender.includes('Masculino')), color: '#dbeafe', text: '#1e40af', icon: '🌊' },
            { label: 'Unissex', groups: aromaticGroups.filter(g => g.gender === 'Unissex'), color: '#f3e8ff', text: '#7c3aed', icon: '✨' },
          ].map(section => (
            <div
              key={section.label}
              className="rounded-xl border p-4"
              style={{ borderColor: `${section.text}30`, backgroundColor: section.color }}
            >
              <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: section.text }}>
                <span>{section.icon}</span> {section.label}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {section.groups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroup(g)}
                    className="text-xs px-2 py-1 rounded-full font-medium border hover:opacity-75 transition-opacity cursor-pointer"
                    style={{ backgroundColor: g.color, color: g.textColor, borderColor: `${g.color}80` }}
                  >
                    {g.icon} {g.name}
                  </button>
                ))}
                {section.groups.length === 0 && (
                  <span className="text-xs text-muted-foreground opacity-70 italic">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Modal */}
      {activeGroup && (
        <GroupModal group={activeGroup} onClose={() => setActiveGroup(null)} />
      )}
    </>
  );
}
