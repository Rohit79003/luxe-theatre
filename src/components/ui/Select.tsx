import React, { useId } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium uppercase tracking-wider text-zinc-400"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-zinc-900/90 text-zinc-100 text-sm rounded-lg border ${
          error ? "border-red-500/80" : "border-zinc-800 focus:border-amber-500/80 focus:ring-amber-500/20"
        } px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
};
