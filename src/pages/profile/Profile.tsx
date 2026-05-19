import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, LogOut, ChevronRight, TrendingUp, Plus,
  Pencil, Check, X, Eye, EyeOff, Phone, Mail, User, Lock, MapPin
} from "lucide-react";
import { UserService } from "../../services/UserService";
import { BairroService } from "../../services/BairroService";
import { Bairro } from "../../models/Bairro";

const userService = new UserService();
const bairroService = new BairroService();

// ─── Field helper ──────────────────────────────────────────────────────────

function ProfileField({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  disabled = false,
  error,
  placeholder,
  readOnly = false,
}: {
  label: string;
  icon?: any;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {Icon && <Icon style={{ width: 14, height: 14 }} />}
        {label}
        {readOnly && (
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginLeft: 4 }}>
            (somente leitura)
          </span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled || readOnly}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: 44,
            padding: isPassword ? "0 44px 0 16px" : "0 16px",
            borderRadius: 12,
            border: error
              ? "1px solid rgba(239,68,68,0.5)"
              : "1px solid rgba(255,255,255,0.15)",
            background:
              readOnly || disabled
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.08)",
            color:
              readOnly || disabled ? "rgba(255,255,255,0.3)" : "#fff",
            fontSize: 14,
            outline: "none",
            cursor: readOnly || disabled ? "not-allowed" : "text",
            boxSizing: "border-box",
            transition: "all 0.2s",
          }}
        />
        {isPassword && !readOnly && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#f87171", display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
          <X style={{ width: 12, height: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

type AlertState = {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
} | null;

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [bairroId, setBairroId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const data = await bairroService.getBairros();
        setBairros(data);
      } catch {}
    };

    const fetchProfile = async () => {
      try {
        const usuario = await userService.getProfile();
        setName(usuario.nome);
        setEmail(usuario.email);
        setCpf(usuario.cpf ?? "");
        setBairroId(usuario.bairroId ?? 0);
      } catch {}
    };

    fetchBairros();
    fetchProfile();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nome é obrigatório.";
    if (!email.trim()) errs.email = "E-mail é obrigatório.";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await userService.updateProfile({ nome: name, email, cpf, senha: "", bairroId });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setErrors({ general: "Erro ao salvar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    window.location.href = "/";
  };

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f1e2e", color: "#fff" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(to bottom, #091525, #0f1e2e)",
          paddingTop: 96,
          paddingBottom: 32,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div style={{ maxWidth: 672, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 0 24px rgba(59,130,246,0.4)",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>{name || "Usuário"}</h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "4px 0 0" }}>{email}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <Shield style={{ width: 14, height: 14, color: "#60a5fa" }} />
                <span style={{ fontSize: 12, color: "#60a5fa", fontWeight: 500 }}>cidadão</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 672, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Informações Pessoais ────────────────────────────────── */}
        <section
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <User style={{ width: 16, height: 16, color: "#60a5fa" }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>Informações Pessoais</h2>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  height: 32,
                  padding: "0 12px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                <Pencil style={{ width: 12, height: 12 }} /> Editar
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {saved && (
                  <span style={{ fontSize: 12, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
                    <Check style={{ width: 12, height: 12 }} /> Salvo!
                  </span>
                )}
                <button
                  onClick={handleCancel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    height: 32,
                    padding: "0 12px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: 12, height: 12 }} /> Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Fields */}
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {errors.general && (
              <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>{errors.general}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
              <ProfileField
                label="Nome completo"
                icon={User}
                value={name}
                onChange={setName}
                placeholder="Seu nome"
                disabled={!editing}
                error={errors.name}
              />
              <ProfileField
                label="E-mail"
                icon={Mail}
                value={email}
                type="email"
                readOnly
                placeholder="seu@email.com"
              />
              <ProfileField
                label="CPF"
                icon={User}
                value={cpf}
                onChange={setCpf}
                placeholder="000.000.000-00"
                disabled={!editing}
              />
            </div>

            {/* Bairro select */}
            {editing && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin style={{ width: 14, height: 14 }} /> Bairro
                </label>
                <select
                  value={bairroId}
                  onChange={(e) => setBairroId(Number(e.target.value))}
                  style={{
                    height: 44,
                    padding: "0 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    width: "100%",
                  }}
                >
                  <option value="">Selecione seu bairro</option>
                  {bairros.map((b) => (
                    <option key={b.id} value={b.id} style={{ background: "#0f1e2e" }}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Save button */}
            {editing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: loading ? "rgba(37,99,235,0.5)" : "#2563eb",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    borderRadius: 12,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#3b82f6"; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: 16, height: 16,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check style={{ width: 16, height: 16 }} /> Salvar Alterações
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── Conta ──────────────────────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h2 style={{ fontWeight: 600, color: "#fff", marginBottom: 8, fontSize: 15 }}>Conta</h2>

          <Link
            to="/ocorrencias"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Shield style={{ width: 16, height: 16, color: "#60a5fa" }} />
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
              Ver todas as ocorrências
            </span>
            <ChevronRight style={{ width: 16, height: 16, color: "rgba(255,255,255,0.2)" }} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              background: "rgba(239,68,68,0.08)",
              borderRadius: 12,
              border: "1px solid rgba(239,68,68,0.2)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(239,68,68,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <LogOut style={{ width: 16, height: 16, color: "#f87171" }} />
            </div>
            <span style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: 500, color: "#f87171" }}>
              Sair da conta
            </span>
          </button>
        </section>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Profile;