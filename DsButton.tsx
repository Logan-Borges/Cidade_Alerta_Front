/**
 * DS: DsButton
 * Design-System button with variants: primary | secondary | ghost | danger | outline
 * Sizes: sm | md | lg
 */
// import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:   "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-glow active:scale-[0.98]",
  secondary: "bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]",
  ghost:     "bg-white/8 hover:bg-white/15 text-white/80 hover:text-white border border-white/15",
  danger:    "bg-red-500 hover:bg-red-400 text-white active:scale-[0.98]",
  dangerSoft:"bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400",
  outline:   "bg-transparent border border-border text-foreground hover:bg-muted/60",
  blueSoft:  "bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400",
};

const SIZES = {
  sm: "h-9  px-4  text-xs  rounded-xl gap-1.5",
  md: "h-11 px-5  text-sm  rounded-xl gap-2",
  lg: "h-14 px-8  text-base rounded-2xl gap-2.5",
};

export default function DsButton({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  type = "button",
  onClick,
  fullWidth = false,
}: {
  variant?: keyof typeof VARIANTS,
  size?: keyof typeof SIZES,
  loading?: boolean,
  disabled?: boolean,
  className?: string,
  children?: React.ReactNode,
  type?: "button" | "submit" | "reset",
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  fullWidth?: boolean,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 
        ${VARIANTS[variant] || VARIANTS.primary} 
        ${SIZES[size] || SIZES.md} 
        ${fullWidth ? "w-full" : ""} 
        ${(disabled || loading) ? "opacity-50 cursor-not-allowed" : ""} 
        ${className}`}
    >
      {loading ? (
        <>
          {/* <Loader2 className="w-4 h-4 animate-spin" /> */}
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
