import { Shield, AlertTriangle, TrendingUp, Plus } from "lucide-react";
import Occurrence, { OccurrenceData } from "./Occurrence";
import SkeletonOccurrence from "./SkeletonOccurrence";

const MOCK_OCCURRENCES: OccurrenceData[] = [
    { id: 1,  title: "Buraco enorme na Rua das Flores",          description: "Buraco de aproximadamente 1 metro de diâmetro está causando acidentes e dificultando o trânsito.", category: "infraestrutura", urgency: "alta",    status: "ativo",     neighborhood: "Centro",         views: 42, created_date: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 2,  title: "Acidente com dois veículos na Av. Brasil",   description: "Colisão entre carro e moto deixou uma pessoa ferida. Equipe do SAMU foi acionada.",              category: "transito",       urgency: "critica", status: "ativo",     neighborhood: "Vila Nova",      views: 87, created_date: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: 3,  title: "Alagamento bloqueia via no Jardim Europa",   description: "Chuvas fortes causaram alagamento impedindo passagem de veículos na região.",                    category: "infraestrutura", urgency: "alta",    status: "ativo",     neighborhood: "Jardim Europa",  views: 31, created_date: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 4,  title: "Assalto a mão armada próximo ao mercado",    description: "Dois suspeitos abordaram pedestres e fugiram em moto. Boletim de ocorrência registrado.",          category: "seguranca",      urgency: "critica", status: "resolvido", neighborhood: "São Jorge",      views: 64, created_date: new Date(Date.now() - 26 * 86400000).toISOString() },
    { id: 5,  title: "Incêndio em vegetação no Parque Municipal",  description: "Foco de incêndio em área de mata ciliar foi controlado pelo Corpo de Bombeiros.",                category: "meio_ambiente",  urgency: "alta",    status: "resolvido", neighborhood: "Parque Sul",     views: 55, created_date: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 6,  title: "Lâmpadas apagadas na Rua Marechal Rondon",   description: "Trecho de 300 metros sem iluminação pública há mais de uma semana, gerando insegurança.",        category: "infraestrutura", urgency: "media",   status: "ativo",     neighborhood: "Boa Vista",      views: 19, created_date: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: 7,  title: "Vandalismo em ponto de ônibus",              description: "Abrigo do ponto de ônibus foi depredado, vidros quebrados e banco destruído.",                    category: "seguranca",      urgency: "baixa",   status: "ativo",     neighborhood: "Alto da Serra",  views: 12, created_date: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 8,  title: "Descarte irregular de lixo na calçada",      description: "Moradores jogam entulho e lixo em área pública, gerando mau cheiro e proliferação de insetos.",   category: "meio_ambiente",  urgency: "media",   status: "ativo",     neighborhood: "Novo Horizonte", views: 28, created_date: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 9,  title: "Semáforo com defeito causa congestionamento", description: "Semáforo oscilando em amarelo no cruzamento movimentado trava o trânsito nos horários de pico.", category: "transito",       urgency: "alta",    status: "ativo",     neighborhood: "Centro",         views: 73, created_date: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: 10, title: "Calçada quebrada causa queda de idosa",      description: "Pedestre tropeçou em calçada danificada e sofreu lesões no joelho. Área sinalizada.",            category: "infraestrutura", urgency: "media",   status: "resolvido", neighborhood: "Vila Operária",  views: 34, created_date: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 11, title: "Esgoto a céu aberto na Rua do Ipê",          description: "Vazamento de esgoto contamina rua e calçada, exalando mau cheiro na região há dias.",            category: "saude",          urgency: "critica", status: "ativo",     neighborhood: "Ipiranga",       views: 91, created_date: new Date(Date.now() - 12 * 3600000).toISOString() },
    { id: 12, title: "Árvore caída bloqueia rua após tempestade",  description: "Árvore de grande porte caiu sobre a pista durante a chuva de ontem, interditando a via.",        category: "meio_ambiente",  urgency: "alta",    status: "resolvido", neighborhood: "Bosque",         views: 47, created_date: new Date(Date.now() - 1 * 86400000).toISOString() },
];

interface OccurrenceListProps {
    occurrences?: OccurrenceData[];
    loading?: boolean;
}

const OccurrenceList = ({ occurrences, loading = false }: OccurrenceListProps) => {
    const data = occurrences ?? MOCK_OCCURRENCES;

    const totalCount    = data.length;
    const activeCount   = data.filter((o) => o.status === "ativo").length;
    const criticalCount = data.filter((o) => o.urgency === "critica").length;
    const resolvedCount = data.filter((o) => o.status === "resolvido").length;

    return (
        <div className="min-h-screen bg-white">

            {/* Header */}
            <div className="bg-[#0F172A] px-6 py-8">
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
            <div className="w-full px-6 py-6">

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <SkeletonOccurrence key={i} />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="font-medium text-gray-600">Nenhuma ocorrência encontrada</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
                        {data.map((occurrence, index) => (
                            <Occurrence key={occurrence.id ?? index} occurrence={occurrence} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OccurrenceList;