import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormMessageProps {
  message?: string;
  error?: boolean;
  className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({
  message,
  error = false,
  className,
}) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm mt-1 animate-fade-in",
        error ? "text-red-500" : "text-gray-500",
        className
      )}
    >
      {error && <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
};
