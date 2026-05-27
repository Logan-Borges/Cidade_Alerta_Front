/**
 * DS: DsTextarea
 * Multi-line text area for dark (navy) surfaces.
 */

export default function DsTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  className = "",
}) {
  return (
    <textarea
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3.5 bg-white/8 border border-white/15 rounded-xl text-white
        placeholder:text-white/30 text-sm resize-none transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  );
}
