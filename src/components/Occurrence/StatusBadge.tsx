// src/components/Occurrence/StatusBadge.tsx

interface StatusConfig {
    label: string
    classes: string
}

const STATUS_MAP: Record<string, StatusConfig> = {
    ativo: {
        label: "Ativo",
        classes: "bg-orange-500/15 border border-orange-500/20 text-orange-300",
    },
    em_analise: {
        label: "Em análise",
        classes: "bg-blue-500/15 border border-blue-500/20 text-blue-300",
    },
    em_atendimento: {
        label: "Em atendimento",
        classes: "bg-purple-500/15 border border-purple-500/20 text-purple-300",
    },
    resolvido: {
        label: "Resolvido",
        classes: "bg-green-500/15 border border-green-500/20 text-green-300",
    },
}

interface StatusBadgeProps {
    status?: string | null
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_MAP[status ?? ""] ?? {
        label: status ?? "—",
        classes: "bg-gray-500/15 border border-gray-500/20 text-gray-400",
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.classes}`}
        >
            {config.label}
        </span>
    )
}
