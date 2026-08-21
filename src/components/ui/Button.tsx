import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs tracking-wider uppercase",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-7 py-3.5 text-base tracking-wide font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-zinc-950 hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-[0.98]",
    secondary:
      "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/50 active:scale-[0.98]",
    outline:
      "border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 active:scale-[0.98]",
    ghost:
      "text-zinc-300 hover:text-white hover:bg-zinc-800/50 active:scale-[0.98]",
    danger:
      "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-[0.98]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
