// src/components/Occurrence/StatusSelector.tsx

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { OccurrenceService } from "../../services/OccurrenceService"

const STATUS_OPTIONS = [
    { value: "ativo",          label: "Ativo" },
    { value: "em_analise",     label: "Em análise" },
    { value: "em_atendimento", label: "Em atendimento" },
    { value: "resolvido",      label: "Resolvido" },
]

const TRIGGER_COLORS: Record<string, { dot: string; text: string; border: string; bg: string }> = {
    ativo:          { dot: "bg-orange-400", text: "text-orange-600", border: "border-orange-300", bg: "bg-orange-50" },
    em_analise:     { dot: "bg-blue-400",   text: "text-blue-600",   border: "border-blue-300",   bg: "bg-blue-50"   },
    em_atendimento: { dot: "bg-purple-400", text: "text-purple-600", border: "border-purple-300", bg: "bg-purple-50" },
    resolvido:      { dot: "bg-green-400",  text: "text-green-600",  border: "border-green-300",  bg: "bg-green-50"  },
}

const OPTION_HOVER: Record<string, string> = {
    ativo:          "hover:bg-orange-50",
    em_analise:     "hover:bg-blue-50",
    em_atendimento: "hover:bg-purple-50",
    resolvido:      "hover:bg-green-50",
}

interface StatusSelectorProps {
    occurrenceId: number
    currentStatus?: string | null
    onUpdated?: (newStatus: string) => void
}

export function StatusSelector({ occurrenceId, currentStatus, onUpdated }: StatusSelectorProps) {
    const [status, setStatus]   = useState(currentStatus ?? "ativo")
    const [open, setOpen]       = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState(false)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

    const triggerRef = useRef<HTMLButtonElement>(null)
    const svc = new OccurrenceService()
    const colors = TRIGGER_COLORS[status] ?? TRIGGER_COLORS.ativo
    const label  = STATUS_OPTIONS.find(o => o.value === status)?.label ?? status

    // Fecha ao clicar fora
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            const target = e.target as Node
            if (triggerRef.current && !triggerRef.current.contains(target)) {
                // verifica se clicou dentro do portal
                const portal = document.getElementById("status-dropdown-portal")
                if (portal && portal.contains(target)) return
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        // posiciona à direita do botão, alinhado verticalmente ao centro
        setDropdownPos({
            top:  rect.top + window.scrollY,
            left: rect.right + window.scrollX + 8,
        })
        setOpen(o => !o)
    }

    const handleSelect = async (value: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (value === status) { setOpen(false); return }
        setOpen(false)
        setError(false)
        setLoading(true)
        const prev = status
        setStatus(value)

        try {
            await svc.updateStatus(occurrenceId, value)
            onUpdated?.(value)
        } catch {
            setStatus(prev)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const dropdown = open ? createPortal(
        <div
            id="status-dropdown-portal"
            style={{ position: "absolute", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 py-1 min-w-[160px] overflow-hidden">
                {STATUS_OPTIONS.map((opt) => {
                    const oc = TRIGGER_COLORS[opt.value]
                    const isSelected = opt.value === status
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => handleSelect(opt.value, e)}
                            className={`
                                w-full flex items-center gap-2 px-3 py-2
                                text-xs font-medium text-left text-gray-700
                                transition-colors cursor-pointer
                                ${OPTION_HOVER[opt.value]}
                                ${isSelected ? "bg-gray-50 font-semibold" : ""}
                            `}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${oc.dot}`} />
                            {opt.label}
                            {isSelected && (
                                <svg className="ml-auto w-3 h-3 text-gray-400" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>,
        document.body
    ) : null

    return (
        <div
            className="relative inline-block"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button
                ref={triggerRef}
                type="button"
                disabled={loading}
                onClick={handleOpen}
                className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    text-xs font-medium border cursor-pointer
                    transition-all select-none
                    ${colors.bg} ${colors.border} ${colors.text}
                    ${loading ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"}
                `}
            >
                {loading
                    ? <span className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />
                    : <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                }
                {label}
                <svg
                    className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12" fill="none"
                >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {error && (
                <span className="ml-1.5 text-[10px] text-red-500 font-medium">Erro ao salvar</span>
            )}

            {dropdown}
        </div>
    )
}