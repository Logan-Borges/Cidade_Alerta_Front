import React, { useEffect, useState } from "react";
import { Shield, AlertTriangle, TrendingUp, Plus } from "lucide-react";
import Occurrence, { OccurrenceData } from "./Occurrence";
import SkeletonOccurrence from "./SkeletonOccurrence";
import { OccurrenceService } from "../../services/OccurrenceService";

const FILTER_TABS = [
    { label: "Todos",        value: "todos",         icon: null },
    { label: "Assalto",      value: "seguranca",     icon: "🛡️" },
    { label: "Acidente",     value: "transito",      icon: "🚗" },
    { label: "Alagamento",   value: "alagamento",    icon: "🌊" },
    { label: "Incêndio",     value: "incendio",      icon: "🔥" },
    { label: "Vandalismo",   value: "vandalismo",    icon: "🔨" },
    { label: "Buraco na Via",value: "infraestrutura",icon: "⚠️" },
    { label: "Iluminação",   value: "iluminacao",    icon: "💡" },
    { label: "Outros",       value: "outros",        icon: "···" },
];

// Mapeamento de filtro para categorias reais
const FILTER_TO_CATEGORY: Record<string, string[]> = {
    todos:         [],
    seguranca:     ["seguranca"],
    transito:      ["transito"],
    alagamento:    ["infraestrutura"],
    incendio:      ["meio_ambiente"],
    vandalismo:    ["seguranca"],
    infraestrutura:["infraestrutura"],
    iluminacao:    ["infraestrutura"],
    outros:        ["saude", "outros"],
};

interface OccurrenceListProps {
    occurrences?: OccurrenceData[];
    loading?: boolean;
}

const OccurrenceList = ({ occurrences, loading = false }: OccurrenceListProps) => {
    const [data, setData] = useState<OccurrenceData[]>(occurrences ?? []);
    const [isLoading, setIsLoading] = useState<boolean>(loading);

    const occurrenceService = new OccurrenceService();

    useEffect(() => {
        if (occurrences) {
            setData(occurrences);
            setIsLoading(loading);
            return;
        }

        let mounted = true;
        setIsLoading(true);
        occurrenceService.getOccurrences<any[]>()
            .then((items) => {
                if (!mounted) return;
                const mapped: OccurrenceData[] = Array.isArray(items)
                    ? items.map((it: any) => ({
                          id: it.id,
                          title: it.titulo ?? it.title,
                          description: it.descricao ?? it.description,
                          category: it.tipo ?? it.category,
                          urgency: it.urgencia ?? it.urgency,
                          status: it.status,
                          neighborhood: it.bairro ?? (it.bairroId ? String(it.bairroId) : undefined),
                          image_url: it.fotoBase64 ? `data:image/jpeg;base64,${it.fotoBase64}` : it.image_url,
                          totalUrgencia: it.totalUrgencia ?? 0,
                          curtido: it.curtido ?? false,
                          created_date: it.created_date ?? undefined,
                      }))
                    : [];
                setData(mapped);
            })
            .catch(() => {
                // ignore errors for now
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [occurrences, loading]);

    const handleToggleUrgency = async (id?: number) => {
        if (!id) return;
        try {
            const resp = await occurrenceService.toggleUrgencia(id);
            // resp expected: { usuarioId, ocorrenciaId, curtido, totalUrgencias }
            setData((prev) =>
                prev.map((item) =>
                    item.id === resp.ocorrenciaId
                        ? { ...item, totalUrgencia: resp.totalUrgencias, curtido: resp.curtido }
                        : item
                )
            );
        } catch (e) {
            // ignore for now
        }
    };

    const totalCount = data.length;
    const activeCount = data.filter((o) => o.status === "ativo").length;
    const criticalCount = data.filter((o) => o.urgency === "critica").length;
    const resolvedCount = data.filter((o) => o.status === "resolvido").length;

    const filtered = data.filter((o) => {
        const matchSearch =
            !search ||
            o.title?.toLowerCase().includes(search.toLowerCase()) ||
            o.description?.toLowerCase().includes(search.toLowerCase()) ||
            o.neighborhood?.toLowerCase().includes(search.toLowerCase());

        const cats = FILTER_TO_CATEGORY[activeFilter] ?? [];
        const matchFilter = activeFilter === "todos" || cats.includes(o.category ?? "");

        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-white mt-[60px]">

            {/* Header */}
            <div className="bg-[#0F172A] px-6 pb-8 pt-[80px]">
                <div className="w-full">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Ocorrências</h1>
                            <p className="text-white/50 text-sm">Monitoramento em tempo real da sua cidade</p>
                        </div>

                        <a
                            href="/reportar"
                            className="inline-flex items-center gap-2 h-11 px-5 bg-[#ef671f] hover:bg-orange-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-orange-500/30"
                        >
                            <Plus className="w-4 h-4" />
                            Reportar
                        </a>
                    </div>

                    {/* Stat pills */}
                    <div className="flex gap-3 flex-wrap">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs font-medium">
                            <Shield className="w-3.5 h-3.5" />
                            {totalCount} total
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-300 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                            {activeCount} ativos
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/20 text-red-300 text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {criticalCount} críticos
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-300 text-xs font-medium">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {resolvedCount} resolvidos
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-6 py-6 bg-[#f8fafc] flex-1">

                {/* Search + Filters */}
                <div className="mb-5 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar ocorrências..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filtros
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap mb-5">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveFilter(tab.value)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                activeFilter === tab.value
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {tab.icon && <span className="text-xs">{tab.icon}</span>}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Count */}
                <p className="text-sm text-gray-500 mb-4">
                    {filtered.length} ocorrência{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
                </p>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 max-h-[calc(100vh-18rem)] overflow-y-auto">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <SkeletonOccurrence key={i} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="font-medium text-gray-600">Nenhuma ocorrência encontrada</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 max-h-[calc(100vh-18rem)] overflow-y-auto">
                        {data.map((occurrence, index) => (
                            <Occurrence key={occurrence.id ?? index} occurrence={occurrence} index={index} onToggleUrgency={handleToggleUrgency} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OccurrenceList;