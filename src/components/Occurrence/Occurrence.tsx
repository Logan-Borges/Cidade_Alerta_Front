import { motion } from "framer-motion";
import { MapPin, Clock, Eye, ArrowUpRight } from "lucide-react";

export interface OccurrenceData {
    id?: number;
    title?: string;
    description?: string;
    category?: string;
    urgency?: "baixa" | "media" | "alta" | "critica";
    status?: string;
    neighborhood?: string;
    image_url?: string;
    views?: number;
    created_date?: string;
}

// ── Categoria ────────────────────────────────────────────────────────────────

const CATEGORIES: Record<string, { label: string; bg: string; border: string; text: string }> = {
    infraestrutura: {
        label: "Infraestrutura",
        bg: "bg-blue-500/15",
        border: "border-blue-500/30",
        text: "text-blue-400",
    },
    seguranca: {
        label: "Segurança",
        bg: "bg-red-500/15",
        border: "border-red-500/30",
        text: "text-red-400",
    },
    saude: {
        label: "Saúde",
        bg: "bg-green-500/15",
        border: "border-green-500/30",
        text: "text-green-400",
    },
    transito: {
        label: "Trânsito",
        bg: "bg-yellow-500/15",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
    },
    meio_ambiente: {
        label: "Meio Ambiente",
        bg: "bg-emerald-500/15",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
    },
    outros: {
        label: "Outros",
        bg: "bg-gray-500/15",
        border: "border-gray-500/30",
        text: "text-gray-400",
    },
};

// ── Urgência ─────────────────────────────────────────────────────────────────

const URGENCY: Record<string, { label: string; bg: string; dot: string; color: string }> = {
    baixa: {
        label: "Baixa",
        bg: "bg-green-500/20",
        dot: "bg-green-400",
        color: "text-green-300",
    },
    media: {
        label: "Média",
        bg: "bg-yellow-500/20",
        dot: "bg-yellow-400",
        color: "text-yellow-300",
    },
    alta: {
        label: "Alta",
        bg: "bg-orange-500/20",
        dot: "bg-orange-400",
        color: "text-orange-300",
    },
    critica: {
        label: "Crítica",
        bg: "bg-red-500/20",
        dot: "bg-red-400",
        color: "text-red-300",
    },
};

// ── Ícone de categoria ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
    infraestrutura: "🔧",
    seguranca: "🛡️",
    saude: "🏥",
    transito: "🚦",
    meio_ambiente: "🌿",
    outros: "📌",
};

// ── Helper de tempo relativo ──────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `há ${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `há ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `há ${days}d`;
}

// ── Componente ────────────────────────────────────────────────────────────────

interface OccurrenceProps {
    occurrence?: OccurrenceData;
    index?: number;
}

const Occurrence = ({ occurrence, index = 0 }: OccurrenceProps) => {
    const cat = CATEGORIES[occurrence?.category ?? ""] ?? CATEGORIES.outros;
    const urg = URGENCY[occurrence?.urgency ?? ""] ?? URGENCY.media;
    const icon = CATEGORY_ICONS[occurrence?.category ?? ""] ?? "📌";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group"
        >
            <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-card card-hover cursor-pointer">
                {/* Image or Gradient Header */}
                <div className={`relative h-36 ${cat.bg} flex items-center justify-center overflow-hidden`}>
                    {occurrence?.image_url ? (
                        <img
                            src={occurrence.image_url}
                            alt={occurrence.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className={`w-16 h-16 rounded-2xl ${cat.bg} border ${cat.border} flex items-center justify-center text-2xl`}>
                            {icon}
                        </div>
                    )}

                    {/* Urgency pip */}
                    <div className="absolute top-3 right-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${urg.bg} border border-white/10 backdrop-blur-sm`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${urg.dot} animate-pulse`} />
                            <span className={`text-xs font-medium ${urg.color}`}>{urg.label}</span>
                        </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cat.bg} border ${cat.border} backdrop-blur-sm`}>
                            <span className="text-xs">{icon}</span>
                            <span className={`text-xs font-medium ${cat.text}`}>{cat.label}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 flex-1">
                            {occurrence?.title ?? "Sem título"}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {occurrence?.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {occurrence.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">
                                {occurrence?.neighborhood ?? "—"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {(occurrence?.views ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {occurrence!.views}
                                </span>
                            )}
                            {occurrence?.created_date && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {timeAgo(occurrence.created_date)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </motion.div>
    );
};

export default Occurrence;