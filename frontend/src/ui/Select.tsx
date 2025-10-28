type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, error, options, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-[var(--color-muted)]">{label}</label>}
      <select
        className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${error ? "border-[var(--color-danger)]" : ""}`}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
