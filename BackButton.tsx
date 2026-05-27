/**
 * DS: BackButton
 * Standard back icon button used in detail/edit page headers.
 */
// import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ onClick }) {
  const navigate = useNavigate();
  const handleClick = onClick || (() => navigate(-1));
  return (
    <button
      onClick={handleClick}
      className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all flex-shrink-0"
      aria-label="Voltar"
    >
      {/* <ArrowLeft className="w-4 h-4" /> */}
    </button>
  );
}
