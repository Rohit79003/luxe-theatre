import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = false,
  onClick,
}) => {
  const hoverStyles = hoverEffect
    ? "hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 shadow-lg ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
