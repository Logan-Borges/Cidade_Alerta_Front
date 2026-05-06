/**
 * DS: DsInput
 * Floating-label text input for dark (navy) surfaces.
 * Props: label, value, onChange, placeholder, icon, type, disabled
 */
type DsInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
  className?: string;
};
export default function DsInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  disabled = false,
  className = "",
}: DsInputProps) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || label}
        className={
          `w-full pr-4 h-12 bg-white/8 border border-white/15 rounded-xl text-white
          placeholder:text-white/30 text-sm transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50,
          disabled:opacity-50 disabled:cursor-not-allowed,
          ${icon ? 'pl-10' : 'pl-4'}`
        }
      />
      {label && (
        <label className="absolute -top-2 left-3 px-1 bg-navy-800 text-xs text-white/50 font-medium pointer-events-none">
          {label}
        </label>
      )}
    </div>
  );
}