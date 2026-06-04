import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { BaseService } from "../../services/BaseService";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

// ── Serviço dedicado de Analytics ────────────────────────────────────────────
class AnalyticsService extends BaseService {
  async getDashboard(): Promise<AnalyticsData> {
    return this.get<AnalyticsData>("/analytics");
  }
}
const svc = new AnalyticsService();

// ── Tipos vindos do back ──────────────────────────────────────────────────────
interface DayCount   { date: string; count: number }
interface BairroCount { bairroId: number; bairroNome: string; count: number }

interface AnalyticsData {
  total:          number;
  ativos:         number;
  criticos:       number;
  resolvidos:     number;
  porTipo:        Record<string, number>;
  porStatus:      Record<string, number>;
  porUrgencia:    Record<string, number>;
  timelineSemana: DayCount[];
  topBairros:     BairroCount[];
}

type Item = { name: string; value: number };

// ── Lookups de labels ─────────────────────────────────────────────────────────
const CAT: Record<string, string> = {
  infraestrutura: "Infraestrutura", seguranca: "Segurança", transito: "Trânsito",
  saude: "Saúde", meio_ambiente: "Meio Ambiente", outros: "Outros",
};
const URG: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };
const STA: Record<string, string> = {
  ativo: "Ativo", em_analise: "Em Análise",
  em_atendimento: "Em Atendimento", resolvido: "Resolvido",
};
const CC = ["#6366f1","#f97316","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6"];
const UC = ["#10b981","#f59e0b","#f97316","#ef4444"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const mapToItems = (obj: Record<string, number>, labels: Record<string, string>): Item[] =>
  Object.entries(obj)
    .map(([key, value]) => ({ name: labels[key] ?? key, value }))
    .sort((a, b) => b.value - a.value);

// ── Estilos base ──────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "linear-gradient(135deg,#0f1e2e,#162536)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20,
  padding: 24,
};

// ── Mini-componentes ──────────────────────────────────────────────────────────
const StatCard = ({
  title, value, sub, icon: I, g, d = 0,
}: { title: string; value: number; sub: string; icon: React.ElementType; g: string; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: d, duration: .45, ease: [.16, 1, .3, 1] as any }}
    style={{ ...card, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: g, opacity: .12, filter: "blur(20px)" }} />
    <div style={{ width: 40, height: 40, borderRadius: 12, background: g, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><I size={18} color="#fff" /></div>
    <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.65)", marginTop: 4 }}>{title}</div>
    <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 2 }}>{sub}</div>
  </motion.div>
);

const Card = ({
  title, sub, children, style = {}, d = 0,
}: { title: string; sub?: string; children: React.ReactNode; style?: React.CSSProperties; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: d, duration: .45, ease: [.16, 1, .3, 1] as any }}
    style={{ ...card, ...style }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 2 }}>{sub}</div>}
    </div>
    {children}
  </motion.div>
);

const Donut = ({ data, colors }: { data: Item[]; colors: string[] }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const S = 150, cx = 75, cy = 75, IR = 40, OR = 68, gap = 0.05;
  let a = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sw = 2 * Math.PI * (d.value / total) - gap, sa = a + gap / 2, ea = sa + sw;
    const p = `M${cx + OR * Math.cos(sa)},${cy + OR * Math.sin(sa)} A${OR},${OR} 0 ${sw > Math.PI ? 1 : 0} 1 ${cx + OR * Math.cos(ea)},${cy + OR * Math.sin(ea)} L${cx + IR * Math.cos(ea)},${cy + IR * Math.sin(ea)} A${IR},${IR} 0 ${sw > Math.PI ? 1 : 0} 0 ${cx + IR * Math.cos(sa)},${cy + IR * Math.sin(sa)} Z`;
    a += 2 * Math.PI * (d.value / total);
    return <path key={i} d={p} fill={colors[i % colors.length]} />;
  });
  return <div style={{ display: "flex", justifyContent: "center" }}><svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>{slices}</svg></div>;
};

const Legend = ({ data, colors }: { data: Item[]; colors: string[] }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
    {data.map((d, i) => (
      <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i % colors.length], flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.45)" }}>{d.name}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>{d.value}</span>
      </div>
    ))}
  </div>
);

const Bars = ({ data }: { data: { day: string; v: number }[] }) => {
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4, height: "100%" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{d.v || ""}</span>
          <motion.div initial={{ height: 0 }} animate={{ height: Math.max(Math.round(d.v / max * 130), 4) }}
            transition={{ delay: .3 + i * .05, duration: .6, ease: [.16, 1, .3, 1] as any }}
            style={{ width: "100%", borderRadius: "5px 5px 0 0", background: "#6366f1", marginTop: "auto" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

const HBars = ({ data, colors }: { data: Item[]; colors: string[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d, i) => (
        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)", width: 88, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
          <div style={{ flex: 1, height: 13, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(d.value / max * 100)}%` }}
              transition={{ delay: .35 + i * .05, duration: .6, ease: [.16, 1, .3, 1] as any }}
              style={{ height: "100%", borderRadius: 4, background: colors[i % colors.length] }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.55)", width: 18, flexShrink: 0 }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Página ────────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [dash, setDash]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useDocumentTitle("Analytics");

  useEffect(() => {
    svc.getDashboard()
      .then(setDash)
      .catch((err) => setError(err.message ?? "Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  // ── Guard de role (depois de todos os hooks) ───────────────────────
  // Proteção centralizada no AdminRoute do App.tsx → redireciona para /
  // Mantemos aqui apenas como segurança extra caso o componente seja usado fora do router

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#07101f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .9, ease: "linear" }}
        style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(255,255,255,.1)", borderTopColor: "#ef671f" }} />
      <span style={{ color: "rgba(255,255,255,.3)", fontSize: 13 }}>Carregando analytics…</span>
    </div>
  );

  // ── Erro ───────────────────────────────────────────────────────────
  if (error || !dash) return (
    <div style={{ minHeight: "100vh", background: "#07101f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
      <AlertTriangle size={32} color="#ef4444" />
      <span style={{ color: "rgba(255,255,255,.5)", fontSize: 14 }}>{error ?? "Sem dados"}</span>
    </div>
  );

  // ── Derivações ─────────────────────────────────────────────────────
  const catData  = mapToItems(dash.porTipo,    CAT);
  const statData = mapToItems(dash.porStatus,  STA);
  const urgData  = mapToItems(dash.porUrgencia, URG);

  const timeline = dash.timelineSemana.map(d => ({
    day: new Date(d.date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
    v: d.count,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#07101f", color: "#fff" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#0a1828,#0f1e2e)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "30px 0 26px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}><Activity size={11} />Visão Geral</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>Analytics</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 3 }}>Estatísticas e padrões de ocorrências da sua cidade</p>
          </div>
          <motion.a href="/reportar" whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", background: "linear-gradient(135deg,#ef671f,#f97316)", color: "#fff", fontWeight: 700, fontSize: 13, borderRadius: 11, textDecoration: "none", boxShadow: "0 4px 18px rgba(239,103,31,.35)" }}>
            <Plus size={14} />Reportar
          </motion.a>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14 }}>
          <StatCard title="Total"     value={dash.total}     sub="Todas as categorias"   icon={Activity}      g="linear-gradient(135deg,#6366f1,#8b5cf6)" d={0}   />
          <StatCard title="Ativos"    value={dash.ativos}    sub="Aguardando ação"        icon={Clock}         g="linear-gradient(135deg,#ef671f,#f97316)"  d={.06} />
          <StatCard title="Críticos"  value={dash.criticos}  sub="Urgência máxima"        icon={AlertTriangle} g="linear-gradient(135deg,#ef4444,#f87171)"  d={.12} />
          <StatCard title="Resolvidos" value={dash.resolvidos} sub="Concluídos com sucesso" icon={CheckCircle2} g="linear-gradient(135deg,#10b981,#34d399)"  d={.18} />
        </div>

        {/* Timeline + Status */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14 }}>
          <Card title="Ocorrências por Dia" sub="Últimos 7 dias" d={.22}><Bars data={timeline} /></Card>
          <Card title="Status Atual" sub="Distribuição" d={.26}><Donut data={statData} colors={CC} /><Legend data={statData} colors={CC} /></Card>
        </div>

        {/* Categoria + Urgência */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14 }}>
          <Card title="Por Categoria" sub="Total por tipo" d={.3}><HBars data={catData} colors={CC} /></Card>
          <Card title="Por Urgência" sub="Nível de criticidade" d={.34}><Donut data={urgData} colors={UC} /><Legend data={urgData} colors={UC} /></Card>
        </div>

        {/* Top bairros */}
        {dash.topBairros.length > 0 && (
          <Card title="Bairros com Mais Ocorrências" sub={`Top ${dash.topBairros.length}`} d={.38}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {dash.topBairros.map(({ bairroNome, count }, i) => {
                const pct = dash.total > 0 ? Math.round(count / dash.total * 100) : 0;
                return (
                  <div key={bairroNome} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.2)", width: 16, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bairroNome}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginLeft: 8, flexShrink: 0 }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,.07)", borderRadius: 4, overflow: "hidden" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(count / (dash.topBairros[0]?.count ?? 1) * 100)}%` }}
                          transition={{ delay: .45 + i * .05, duration: .65, ease: [.16, 1, .3, 1] as any }}
                          style={{ height: "100%", borderRadius: 4, background: CC[i % CC.length] }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}