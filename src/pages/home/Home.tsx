import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, MapPin, CheckCircle,
  ShieldAlert, Car, Waves, Flame, ChevronRight, Users, Zap, Eye
} from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const STATS = [
  { label: "Ocorrências Reportadas", value: "2.4k+", icon: ShieldAlert },
  { label: "Bairros Monitorados", value: "147", icon: MapPin },
  { label: "Resolvidas Hoje", value: "38", icon: CheckCircle },
  { label: "Usuários Ativos", value: "8.9k", icon: Users },
];

const CATEGORIES_DEMO = [
  { key: "assalto", label: "Assalto", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  { key: "acidente", label: "Acidente", icon: Car, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { key: "alagamento", label: "Alagamento", icon: Waves, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { key: "incendio", label: "Incêndio", icon: Flame, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Identifique", desc: "Veja algo suspeito ou urgente na sua cidade.", icon: Eye },
  { step: "02", title: "Reporte", desc: "Abra o app e descreva o incidente em segundos.", icon: Zap },
  { step: "03", title: "Acompanhe", desc: "Monitore o status e veja quando for resolvido.", icon: CheckCircle },
];

export default function Home() {
  const [isAuthed, setIsAuthed] = useState(false);

  useDocumentTitle();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(!!token);
  }, []);

  return (
    <div style={{ backgroundColor: "#0f1e2e", color: "#fff", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.25 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(15,30,46,0.6), rgba(15,30,46,0.85), #0f1e2e)" }}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            opacity: 0.05,
            backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "#4ade80",
                  animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              />
              Plataforma ativa em tempo real
              <ChevronRight className="w-3 h-3" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Sua cidade,
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #ef671f, #f97316, #facc15)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                mais segura
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.9)" }}>agora.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Reporte incidentes, acompanhe ocorrências e ajude a transformar sua comunidade.
              Rápido, simples e eficaz — direto do seu celular.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {isAuthed ? (
                <Link
                  to="/reportar"
                  className="inline-flex items-center justify-center gap-2 font-bold text-lg rounded-2xl text-white transition-all duration-200 group"
                  style={{ height: 64, padding: "0 32px", backgroundColor: "#ef671f", boxShadow: "0 0 24px rgba(239,103,31,0.4)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f97316")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ef671f")}
                >
                  Reportar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/cadastro"
                    className="inline-flex items-center justify-center gap-2 font-bold text-lg rounded-2xl text-white transition-all duration-200 group"
                    style={{ height: 64, padding: "0 32px", backgroundColor: "#ef671f", boxShadow: "0 0 24px rgba(239,103,31,0.4)" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f97316")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ef671f")}
                  >
                    Criar Conta
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-lg rounded-2xl text-white transition-all duration-200"
                    style={{ height: 64, padding: "0 32px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                  >
                    Entrar
                  </Link>
                </>
              )}
              {isAuthed && (
                <Link
                  to="/ocorrencias"
                  className="inline-flex items-center justify-center gap-2 font-semibold text-lg rounded-2xl text-white transition-all duration-200"
                  style={{ height: 64, padding: "0 32px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                >
                  Ver Ocorrências
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#162536", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(59,130,246,0.15)" }}
                >
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Reporte qualquer{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #ef671f, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              incidente
            </span>
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            De acidentes a problemas de infraestrutura, nossa plataforma cobre todas as categorias.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_DEMO.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl ${cat.bg} border ${cat.border} flex flex-col items-center gap-3 text-center cursor-pointer transition-transform hover:scale-105`}
            >
              <cat.icon className={`w-8 h-8 ${cat.color}`} />
              <span className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: "rgba(22,37,54,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simples como deve ser
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Três passos para tornar sua cidade mais segura.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black" style={{ color: "rgba(255,255,255,0.1)" }}>{step.step}</span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(59,130,246,0.15)" }}
                    >
                      <step.icon className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Pronto para fazer a diferença?
          </h2>
          <p className="mb-10 text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Junte-se a milhares de cidadãos que já estão transformando suas cidades.
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 font-bold text-base rounded-2xl text-white transition-all duration-200 group"
            style={{ height: 56, padding: "0 40px", backgroundColor: "#ef671f", boxShadow: "0 0 24px rgba(239,103,31,0.4)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f97316")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ef671f")}
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}