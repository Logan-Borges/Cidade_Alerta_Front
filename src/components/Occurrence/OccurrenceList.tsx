import React, { useEffect, useMemo, useState } from "react";
import { Shield, AlertTriangle, TrendingUp, Plus } from "lucide-react";
import Select from "react-select";
import Occurrence, { OccurrenceData } from "./Occurrence";
import SkeletonOccurrence from "./SkeletonOccurrence";
import OccurrenceMap from "./OccurrenceMap";
import { OccurrenceService } from "../../services/OccurrenceService";
import { UserService } from "../../services/UserService";
import { BairroService } from "../../services/BairroService";
import { User } from "../../models/User";

interface OccurrenceListProps {
    occurrences?: OccurrenceData[];
    loading?: boolean;
}

const URGENCY_FILTERS = [
    { key: "baixa", label: "Baixa", classes: "bg-green-500/15 border border-green-500/20 text-green-300" },
    { key: "media", label: "Média", classes: "bg-yellow-500/15 border border-yellow-500/20 text-yellow-300" },
    { key: "alta", label: "Alta", classes: "bg-orange-500/15 border border-orange-500/20 text-orange-300" },
    { key: "critica", label: "Crítica", classes: "bg-red-500/15 border border-red-500/20 text-red-300" },
];

const STATUS_FILTERS = [
    { key: "ativo", label: "Ativo", classes: "bg-orange-500/15 border border-orange-500/20 text-orange-300" },
    { key: "em_analise", label: "Em análise", classes: "bg-blue-500/15 border border-blue-500/20 text-blue-300" },
    { key: "em_atendimento", label: "Em atendimento", classes: "bg-purple-500/15 border border-purple-500/20 text-purple-300" },
    { key: "resolvido", label: "Resolvido", classes: "bg-green-500/15 border border-green-500/20 text-green-300" },
];

const CATEGORY_FILTERS = [
    { key: "infraestrutura", label: "Infraestrutura" },
    { key: "seguranca", label: "Segurança" },
    { key: "saude", label: "Saúde" },
    { key: "transito", label: "Trânsito" },
    { key: "meio_ambiente", label: "Meio Ambiente" },
    { key: "outros", label: "Outros" },
];

const SORT_FILTERS = [
    { key: "newest", label: "Mais recentes", icon: "↓" },
    { key: "oldest", label: "Mais antigas", icon: "↑" },
    { key: "most_urgent", label: "Mais urgentes", icon: "!" },
    { key: "least_urgent", label: "Menos urgentes", icon: "-" },
];

const OccurrenceList = ({ occurrences, loading = false }: OccurrenceListProps) => {
    const [allData, setAllData] = useState<OccurrenceData[]>(occurrences ?? []);
    const [data, setData] = useState<OccurrenceData[]>(occurrences ?? []);
    const [isLoading, setIsLoading] = useState<boolean>(loading);
    const [selectedUrgency, setSelectedUrgency] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
    const [selectedSort, setSelectedSort] = useState<string>("newest");
    const [showMine, setShowMine] = useState<boolean>(false);
    const [profile, setProfile] = useState<User | null>(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(false);
    const [bairroMap, setBairroMap] = useState<Record<number | string, string>>({});
    const [likedUrgencias, setLikedUrgencias] = useState<number[]>([]);

    const occurrenceService = new OccurrenceService();
    const userService = new UserService();
    const bairroService = new BairroService();
    const isUserLogged = Boolean(localStorage.getItem("token"));

    const normalizeNeighborhood = (bairro: any, bairroId: any, neighborhood: any) => {
        // Se vem como objeto com nome
        if (bairro && typeof bairro === "object") {
            const nome = bairro.nome ?? bairro.name;
            if (nome) return String(nome).trim();
        }

        // Se vem como string diretamente
        if (typeof bairro === "string" && bairro.trim() !== "") {
            const trimmedBairro = bairro.trim();
            // Se for numérica, tenta usar o mapa
            if (/^\d+$/.test(trimmedBairro) && bairroMap[parseInt(trimmedBairro)]) {
                return bairroMap[parseInt(trimmedBairro)];
            }
            return trimmedBairro;
        }

        // Se neighborhood está preenchido
        if (typeof neighborhood === "string" && neighborhood.trim() !== "") {
            return neighborhood.trim();
        }

        // Tenta usar o mapa de bairros se vem como ID
        const barrioIdToCheck = bairroId ?? bairro;
        if (barrioIdToCheck !== undefined && barrioIdToCheck !== null) {
            const mapValue = bairroMap[barrioIdToCheck];
            if (mapValue) {
                return mapValue;
            }
        }

        // Fallback para ID
        if (barrioIdToCheck !== undefined && barrioIdToCheck !== null) {
            return String(barrioIdToCheck);
        }

        return undefined;
    };

    const getNeighborhoodId = (bairro: any, bairroId: any) => {
        if (bairroId !== undefined && bairroId !== null) return bairroId;
        if (bairro && typeof bairro === "object" && bairro.id !== undefined) return bairro.id;
        if (typeof bairro === "string" && bairro.trim() !== "" && /^\d+$/.test(bairro.trim())) return bairro.trim();
        return undefined;
    };

    const normalizeOccurrence = (it: any): OccurrenceData => ({
        id: it.id,
        title: it.titulo ?? it.title,
        description: it.descricao ?? it.description,
        category: it.tipo ?? it.category,
        urgency: it.urgencia ?? it.urgency,
        status: it.status,
        neighborhood: normalizeNeighborhood(it.bairro, it.bairroId, it.neighborhood),
        neighborhoodId: getNeighborhoodId(it.bairro, it.bairroId),
        image_url: it.fotoBase64 ? `data:image/jpeg;base64,${it.fotoBase64}` : it.image_url,
        views: it.views,
        totalUrgencia: it.totalUrgencia ?? 0,
        curtido: it.curtido ?? false,
        data: it.data ?? it.created_date ?? it.createdAt ?? undefined,
        created_date: it.data ?? it.created_date ?? it.createdAt ?? undefined,
        userId: it.usuarioId ?? it.userId ?? it.usuario?.id ?? undefined,
        // localização (quando disponível)
        lat: it.lat != null ? Number(it.lat) : it.latitude != null ? Number(it.latitude) : null,
        lng: it.lng != null ? Number(it.lng) : it.longitude != null ? Number(it.longitude) : null,
        rua: it.rua ?? it.logradouro ?? it.street ?? null,
        bairroNome: it.bairroNome ?? it.bairro ?? (it.bairro && it.bairro.nome) ?? null,
    });

    const applyFilters = (items: OccurrenceData[]) =>
        items.filter((item) => {
            if (selectedUrgency && item.urgency !== selectedUrgency) return false;
            if (selectedStatus && item.status !== selectedStatus) return false;
            if (selectedCategory && item.category !== selectedCategory) return false;
            if (selectedNeighborhood && item.neighborhood !== selectedNeighborhood) return false;
            if (showMine && profile?.id != null && item.userId !== profile.id) return false;
            return true;
        });

    const applySorting = (items: OccurrenceData[]) => {
        const sorted = [...items];
        switch (selectedSort) {
            case "newest":
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.data ?? a.created_date ?? 0).getTime();
                    const dateB = new Date(b.data ?? b.created_date ?? 0).getTime();
                    return dateB - dateA;
                });
            case "oldest":
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.data ?? a.created_date ?? 0).getTime();
                    const dateB = new Date(b.data ?? b.created_date ?? 0).getTime();
                    return dateA - dateB;
                });
            case "most_urgent":
                return sorted.sort((a, b) => (b.totalUrgencia || 0) - (a.totalUrgencia || 0));
            case "least_urgent":
                return sorted.sort((a, b) => (a.totalUrgencia || 0) - (b.totalUrgencia || 0));
            default:
                return sorted;
        }
    };

    const neighborhoodOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    allData
                        .map((item) => {
                            if (item.neighborhoodId !== undefined && item.neighborhoodId !== null) {
                                const mapped = bairroMap[item.neighborhoodId];
                                return mapped ?? String(item.neighborhoodId);
                            }
                            return item.neighborhood;
                        })
                        .filter((value): value is string => Boolean(value))
                )
            ).sort((a, b) => a.localeCompare(b, "pt-BR")),
        [allData, bairroMap]
    );

    // Load bairros mapping
    useEffect(() => {
        let mounted = true;
        bairroService
            .getBairros()
            .then((bairros) => {
                if (!mounted) return;
                const map: Record<number | string, string> = {};
                bairros.forEach((bairro) => {
                    if (bairro.id !== undefined && bairro.nome) {
                        map[bairro.id] = bairro.nome;
                    }
                });
                setBairroMap(map);
            })
            .catch(() => {
                if (!mounted) return;
                setBairroMap({});
            });

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (occurrences) {
            const mapped = Array.isArray(occurrences)
                ? occurrences.map((item) => normalizeOccurrence(item))
                : [];
            setAllData(mapped);
            setData(applySorting(applyFilters(mapped)));
            setIsLoading(loading);
            return;
        }

        let mounted = true;
        setIsLoading(true);

        occurrenceService
            .getOccurrences<any[]>()
            .then((items) => {
                if (!mounted) return;
                const mapped = Array.isArray(items) ? items.map((item) => normalizeOccurrence(item)) : [];
                setAllData(mapped);
                setData(applySorting(applyFilters(mapped)));
            })
            .catch(() => {
                if (!mounted) return;
                setAllData([]);
                setData([]);
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [occurrences, loading, bairroMap]);

    // Re-normalize data when bairroMap is loaded or allData changes
    useEffect(() => {
        if (allData.length === 0) return;

        const reNormalized = allData.map((item) => {
            if (item.neighborhoodId === undefined || item.neighborhoodId === null) {
                return item;
            }

            const name = bairroMap[item.neighborhoodId];
            if (name && item.neighborhood !== name) {
                return { ...item, neighborhood: name };
            }

            return item;
        });

        const hasChanges = reNormalized.some((item, index) => item !== allData[index]);
        if (!hasChanges) {
            return;
        }

        setAllData(reNormalized);
        setData(applySorting(applyFilters(reNormalized)));
    }, [bairroMap, allData.length]);

    useEffect(() => {
        if (!isUserLogged) return;

        let mounted = true;
        setIsFetchingProfile(true);

        userService
            .getProfile()
            .then((user) => {
                if (!mounted) return;
                setProfile(user);
            })
            .catch(() => {
                if (!mounted) return;
                setProfile(null);
            })
            .finally(() => {
                if (mounted) setIsFetchingProfile(false);
            });

        return () => {
            mounted = false;
        };
    }, [isUserLogged]);

    useEffect(() => {
        if (!isUserLogged) {
            setLikedUrgencias([]);
            return;
        }

        let mounted = true;

        occurrenceService
            .getUrgencias<number[]>()
            .then((ids) => {
                if (!mounted) return;
                if (Array.isArray(ids)) {
                    setLikedUrgencias(ids.filter((id) => typeof id === "number"));
                }
            })
            .catch(() => {
                if (!mounted) return;
                setLikedUrgencias([]);
            });

        return () => {
            mounted = false;
        };
    }, [isUserLogged, profile?.id]);

    useEffect(() => {
        if (!isUserLogged || allData.length === 0) {
            return;
        }

        const likedSet = new Set(likedUrgencias);
        const updated = allData.map((item) => {
            const liked = Boolean(item.id && likedSet.has(item.id));
            return item.curtido === liked ? item : { ...item, curtido: liked };
        });

        const hasChanges = updated.some((item, index) => item !== allData[index]);
        if (!hasChanges) {
            return;
        }

        setAllData(updated);
        setData(applySorting(applyFilters(updated)));
    }, [likedUrgencias, allData, isUserLogged]);

    useEffect(() => {
        if (occurrences) {
            setData(applySorting(applyFilters(allData)));
            return;
        }

        if (showMine && !isUserLogged) {
            setData([]);
            return;
        }

        if (showMine && isUserLogged && !profile) {
            return;
        }

        setData(applySorting(applyFilters(allData)));
    }, [selectedUrgency, selectedStatus, selectedCategory, selectedNeighborhood, selectedSort, showMine, profile, allData, occurrences, isUserLogged]);

    const handleToggleUrgency = async (id?: number) => {
        if (!id) return;
        try {
            const resp = await occurrenceService.toggleUrgencia(id);
            const occurrenceId = resp.ocorrenciaId ?? resp.ocorrencia ?? id;
            const totalUrgencia = resp.totalUrgencias ?? resp.totalUrgencia;
            const curtidoStatus = resp.curtido;

            const currentLiked = new Set(likedUrgencias);
            const existingLiked = currentLiked.has(occurrenceId);
            const newLiked = curtidoStatus !== undefined ? Boolean(curtidoStatus) : !existingLiked;

            if (newLiked) {
                currentLiked.add(occurrenceId);
            } else {
                currentLiked.delete(occurrenceId);
            }

            setLikedUrgencias(Array.from(currentLiked));

            const updatedAll = allData.map((item) =>
                item.id === occurrenceId
                    ? {
                          ...item,
                          totalUrgencia: totalUrgencia !== undefined ? totalUrgencia : item.totalUrgencia,
                          curtido: newLiked,
                      }
                    : item
            );
            setAllData(updatedAll);
            setData(applySorting(applyFilters(updatedAll)));
        } catch (e) {
            // ignore for now
        }
    };

    // ── T46: atualiza status localmente após mudança pelo ADM ────────────────
    const handleStatusChange = (id: number, newStatus: string) => {
        const updatedAll = allData.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
        );
        setAllData(updatedAll);
        setData(applySorting(applyFilters(updatedAll)));
    };

    const handleFilterPill = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter((current) => (current === value ? "" : value));
    };

    const clearFilters = () => {
        setSelectedUrgency("");
        setSelectedStatus("");
        setSelectedCategory("");
        setSelectedNeighborhood("");
        setSelectedSort("newest");
        setShowMine(false);
    };

    const resultCount = data.length;
    const selectedFiltersCount = [
        selectedUrgency,
        selectedStatus,
        selectedCategory,
        selectedNeighborhood,
        selectedSort !== "newest" ? selectedSort : "",
        showMine ? "mine" : ""
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-white mt-[60px]">

            {/* Header */}
            <div className="bg-[#0F172A] px-6 py-8">
                <div className="w-full">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl font-bold text-white mb-1">Ocorrências</h1>
                            <p className="text-white/50 text-sm">Monitoramento em tempo real da sua cidade</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                disabled={!isUserLogged}
                                onClick={() => setShowMine((prev) => !prev)}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    showMine
                                        ? "bg-white/10 border border-white/20 text-white"
                                        : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                                } ${!isUserLogged ? "opacity-40 cursor-not-allowed" : ""}`}
                            >
                                Minhas ocorrências
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                disabled={selectedFiltersCount === 0}
                                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                    selectedFiltersCount === 0
                                        ? "border-white/10 bg-white/5 text-white/70 opacity-40 cursor-not-allowed"
                                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                                Limpar filtros
                            </button>
                            {selectedFiltersCount > 0 && (
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                                    {selectedFiltersCount} filtro{selectedFiltersCount === 1 ? "" : "s"} ativo{selectedFiltersCount === 1 ? "" : "s"}
                                </span>
                            )}
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                                {resultCount} ocorrência{resultCount === 1 ? "" : "s"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Urgência</span>
                                {URGENCY_FILTERS.map((filter) => (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => handleFilterPill(filter.key, setSelectedUrgency)}
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                            selectedUrgency === filter.key
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : filter.classes
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Status</span>
                                {STATUS_FILTERS.map((filter) => (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => handleFilterPill(filter.key, setSelectedStatus)}
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                            selectedStatus === filter.key
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : filter.classes
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Ordenar por</span>
                                {SORT_FILTERS.map((filter) => (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => handleFilterPill(filter.key, setSelectedSort)}
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                            selectedSort === filter.key
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : "bg-white/5 border border-white/10 text-white/70"
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
                            <div className="flex flex-col gap-2 w-full lg:w-[260px]">
                                <label className="text-xs uppercase tracking-[0.2em] text-white/50 lg:text-right">Categoria</label>
                                <Select
                                    value={selectedCategory ? { label: CATEGORY_FILTERS.find((c) => c.key === selectedCategory)?.label, value: selectedCategory } : null}
                                    onChange={(option) => setSelectedCategory(option?.value || "")}
                                    options={[
                                        { label: "Todas", value: "" },
                                        ...CATEGORY_FILTERS.map((cat) => ({ label: cat.label, value: cat.key }))
                                    ]}
                                    isClearable={false}
                                    isSearchable={true}
                                    placeholder="Selecionar categoria..."
                                    classNamePrefix="category-select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: "#0f172a",
                                            borderColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "9999px",
                                            padding: "4px 8px",
                                            minHeight: "auto",
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            "&:hover": {
                                                borderColor: "rgba(255, 255, 255, 0.2)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)"
                                            }
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: "#0f172a",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            borderRadius: "12px",
                                            marginTop: "8px",
                                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                                        }),
                                        menuList: (base) => ({
                                            ...base,
                                            padding: "8px 0"
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected
                                                ? "rgba(255, 255, 255, 0.3)"
                                                : state.isFocused
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "#0f172a",
                                            color: "white",
                                            padding: "12px 16px",
                                            cursor: "pointer",
                                            "&:active": {
                                                backgroundColor: "rgba(255, 255, 255, 0.15)"
                                            }
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: "white"
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: "white"
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "rgba(255, 255, 255, 0.5)"
                                        })
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-2 w-full lg:w-[260px]">
                                <label className="text-xs uppercase tracking-[0.2em] text-white/50 lg:text-right">Bairro</label>
                                <Select
                                    value={selectedNeighborhood ? { label: selectedNeighborhood, value: selectedNeighborhood } : null}
                                    onChange={(option) => setSelectedNeighborhood(option?.value || "")}
                                    options={[
                                        { label: "Todos", value: "" },
                                        ...neighborhoodOptions.map((bairro) => ({ label: bairro, value: bairro }))
                                    ]}
                                    isClearable={false}
                                    isSearchable={true}
                                    placeholder="Selecionar bairro..."
                                    classNamePrefix="neighborhood-select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: "#0f172a",
                                            borderColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "9999px",
                                            padding: "4px 8px",
                                            minHeight: "auto",
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            "&:hover": {
                                                borderColor: "rgba(255, 255, 255, 0.2)",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)"
                                            }
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: "#0f172a",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            borderRadius: "12px",
                                            marginTop: "8px",
                                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                                        }),
                                        menuList: (base) => ({
                                            ...base,
                                            padding: "8px 0"
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected
                                                ? "rgba(255, 255, 255, 0.3)"
                                                : state.isFocused
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "#0f172a",
                                            color: "white",
                                            padding: "12px 16px",
                                            cursor: "pointer",
                                            "&:active": {
                                                backgroundColor: "rgba(255, 255, 255, 0.15)"
                                            }
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: "white"
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: "white"
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "rgba(255, 255, 255, 0.5)"
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            <div className="w-full px-6 py-4">
                <OccurrenceMap occurrences={data} />
            </div>

            {/* Main Content */}
            <div className="w-full px-6 py-6">

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 max-h-[calc(100vh-18rem)] overflow-y-auto">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <SkeletonOccurrence key={i} />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="font-medium text-gray-600">Nenhuma ocorrência encontrada</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 max-h-[calc(100vh-18rem)] overflow-y-auto">
                        {data.map((occurrence, index) => (
                            <Occurrence key={occurrence.id ?? index} occurrence={occurrence} index={index} onToggleUrgency={handleToggleUrgency} onStatusChange={handleStatusChange} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OccurrenceList;