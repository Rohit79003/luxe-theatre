import React from "react";

export interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Loading Luxe Screens experience...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[160px]">
      <div
        className={`${sizeClasses[size]} border-amber-500/20 border-t-amber-400 rounded-full animate-spin shadow-lg shadow-amber-500/10 mb-4`}
      />
      {message && (
        <p className="text-sm font-medium text-amber-200/80 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
