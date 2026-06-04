import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Bell, Plus } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [userInitial, setUserInitial] = useState("U");

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
    const nome = localStorage.getItem("nome");
    if (nome) setUserInitial(nome[0].toUpperCase());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const isActive = (path: string) => location.pathname === path;
  const isTransparent = location.pathname === "/" && !scrolled;

  // ── Sequência: Início · Ocorrências · Analytics (admin) · Reportar ──
  const navLinks = [
    { label: "Início",      path: "/" },
    { label: "Ocorrências", path: "/ocorrencias" },
    ...(isAdmin ? [{ label: "Analytics", path: "/analytics" }] : []),
    { label: "Reportar",    path: "/reportar" },
  ];

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s ease",
        background:      isTransparent ? "transparent" : "rgba(10,20,35,0.95)",
        backdropFilter:  isTransparent ? "none"        : "blur(12px)",
        borderBottom:    isTransparent ? "none"        : "1px solid rgba(255,255,255,0.08)",
        boxShadow:       isTransparent ? "none"        : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: 64 }}>

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group" style={{ textDecoration: "none" }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6, #ef671f)",
                boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                transition: "box-shadow 0.3s",
              }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white" style={{ letterSpacing: "-0.02em" }}>
              Cidade<span style={{ color: "#f97316" }}>Alerta</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isAnalytics = link.path === "/analytics";
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: "8px 16px", borderRadius: 8, fontSize: 14,
                    fontWeight: isAnalytics ? 600 : 500,
                    textDecoration: "none", transition: "all 0.2s",
                    color: isActive(link.path)
                      ? "#fff"
                      : isAnalytics ? "#f97316" : "rgba(255,255,255,0.7)",
                    background: isActive(link.path)
                      ? isAnalytics ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.1)"
                      : isAnalytics ? "rgba(249,115,22,0.08)" : "transparent",
                    border: isAnalytics
                      ? "1px solid rgba(249,115,22,0.25)"
                      : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.path)) {
                      e.currentTarget.style.color = isAnalytics ? "#fb923c" : "#fff";
                      e.currentTarget.style.background = isAnalytics
                        ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.path)) {
                      e.currentTarget.style.color = isAnalytics ? "#f97316" : "rgba(255,255,255,0.7)";
                      e.currentTarget.style.background = isAnalytics
                        ? "rgba(249,115,22,0.08)" : "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA Desktop: Bell · Reportar · Avatar ── */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Notificações */}
                <Link
                  to="/ocorrencias"
                  className="flex items-center justify-center"
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    color: "rgba(255,255,255,0.7)",
                    transition: "all 0.2s", textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Bell className="w-4 h-4" />
                </Link>

                {/* Reportar (botão laranja) */}
                <Link
                  to="/reportar"
                  className="flex items-center gap-1"
                  style={{
                    height: 36, padding: "0 16px", borderRadius: 12,
                    backgroundColor: "#ef671f", color: "#fff",
                    fontWeight: 600, fontSize: 14,
                    textDecoration: "none", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f97316"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ef671f"; }}
                >
                  <Plus className="w-4 h-4" style={{ marginRight: 4 }} />
                  Reportar
                </Link>

                {/* Avatar */}
                <Link
                  to="/profile"
                  className="flex items-center justify-center"
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "#fff", fontSize: 13, fontWeight: 600,
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px #60a5fa"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {userInitial}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: "8px 16px", borderRadius: 8, fontSize: 14,
                    fontWeight: 500, color: "rgba(255,255,255,0.8)",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  style={{
                    height: 36, padding: "0 16px", borderRadius: 12,
                    backgroundColor: "#ef671f", color: "#fff",
                    fontWeight: 600, fontSize: 14,
                    textDecoration: "none", display: "flex",
                    alignItems: "center", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f97316"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ef671f"; }}
                >
                  Começar
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: 8,
            }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{
              background: "rgba(15,30,46,0.95)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="px-4 py-4" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navLinks.map((link) => {
                const isAnalytics = link.path === "/analytics";
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", padding: "12px 16px", borderRadius: 12,
                      fontSize: 14, fontWeight: isAnalytics ? 600 : 500,
                      textDecoration: "none", transition: "all 0.2s",
                      color: isActive(link.path)
                        ? "#fff"
                        : isAnalytics ? "#f97316" : "rgba(255,255,255,0.7)",
                      background: isActive(link.path)
                        ? isAnalytics ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.1)"
                        : isAnalytics ? "rgba(249,115,22,0.08)" : "transparent",
                      border: isAnalytics
                        ? "1px solid rgba(249,115,22,0.2)"
                        : "1px solid transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div style={{ paddingTop: 8, marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/reportar"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "block", width: "100%", textAlign: "center",
                        padding: "12px 16px", backgroundColor: "#ef671f",
                        color: "#fff", fontWeight: 600, borderRadius: 12,
                        textDecoration: "none", marginBottom: 8,
                      }}
                    >
                      + Reportar Ocorrência
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "block", width: "100%", textAlign: "center",
                        padding: "12px 16px", background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.7)", fontWeight: 500,
                        borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14,
                      }}
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", width: "100%", textAlign: "center",
                      padding: "12px 16px", backgroundColor: "#ef671f",
                      color: "#fff", fontWeight: 600, borderRadius: 12,
                      textDecoration: "none",
                    }}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}