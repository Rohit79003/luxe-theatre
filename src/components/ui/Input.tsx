import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  className = "",
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wider text-zinc-400"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm rounded-lg border ${
            error ? "border-red-500/80 focus:ring-red-500/50" : "border-zinc-800 focus:border-amber-500/80 focus:ring-amber-500/20"
          } ${leftIcon ? "pl-10" : "px-4"} py-3 transition-all duration-200 focus:outline-none focus:ring-2 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};
