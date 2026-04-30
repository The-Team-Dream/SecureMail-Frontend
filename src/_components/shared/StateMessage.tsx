import { LucideIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "./Text";
import { Icons } from "@/constants/icons";

interface StateMessageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "error" | "info" | "empty";
  onRetry?: () => void;
  actionText?: string;
  className?: string;
}

export const StateMessage = ({
  title,
  description,
  icon: Icon = AlertCircle,
  variant = "info",
  onRetry,
  actionText = "Try Again",
  className,
}: StateMessageProps) => {
  
  const variants = {
    error: "bg-error-50 text-error-600 border-error-100",
    empty: "bg-primary-50 text-primary-400 border-primary-100",
    info: "bg-info-50 text-info-600 border-info-100",
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-8 text-center transition-all ${className}`}>
      {/* Icon Container */}
      <div className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full ${variants[variant]}`}>
        <Icon size={32} />
      </div>

      {/* Content */}
      <Text size="xl" font="bold" className="mb-2">{title}</Text>
      <Text size="sm" color="primary-500" font="medium" className="max-w-[320px] mb-6 leading-relaxed">
        {description}

      </Text>

      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
        >
          <Icons.Refresh size={14} className="text-primary" />
          {actionText}
        </Button>
      )}
    </div>
  );
};