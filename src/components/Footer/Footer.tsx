import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "32px 0",
        backgroundColor: "#0f1e2e",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg, #3b82f6, #ef671f)",
            }}
          >
            <Shield className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            Cidade<span style={{ color: "#f97316" }}>Alerta</span>
          </span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          © 2026 CidadeAlerta. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}