import { LucideIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import { Icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

interface StateMessageProps {
  title: string;
  description: string;
  icon?: any;
  image?: string | StaticImageData;
  variant?: "error" | "info" | "empty";
  onRetry?: () => void;
  actionText?: string;
  className?: string;
  imageClassName?: string;
  iconSize?: number;
}

export const StateMessage = ({
  title,
  description,
  icon: Icon = AlertCircle,
  image,
  variant = "info",
  onRetry,
  actionText = "Try Again",
  className,
  imageClassName,
  iconSize = 32,
}: StateMessageProps) => {
  const variants = {
    error: "bg-error-50 text-error-600 border-error-100",
    empty: "bg-primary-50 text-primary-600 border-primary-100",
    info: "bg-info-50 text-info-600 border-info-100",
  };

  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center w-full p-8 text-center transition-all animate-in fade-in duration-500`,
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
        {/* Icon or Image Container */}
        {image ? (
          <div
            className={cn(
              "w-[200px] h-[200px] mb-8 relative flex items-center justify-center",
              imageClassName,
            )}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center w-16 h-16 mb-4 rounded-full",
              variants[variant as keyof typeof variants],
            )}
          >
            <Icon size={iconSize} />
          </div>
        )}

        {/* Content */}
        <Text
          as="h2"
          size={image ? "32" : "xl"}
          font={image ? "normal" : "bold"}
          className={cn("mb-2", image && "mb-3")}
        >
          {title}
        </Text>
        <Text
          size="sm"
          color={image ? undefined : "muted"}
          font={image ? "normal" : "medium"}
          className={cn(
            "max-w-[320px] mb-6 leading-relaxed",
            image && "text-[#AAAAAE] leading-[1.6] mb-8 px-2 max-w-none",
          )}
        >
          {description}
        </Text>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant={image ? "default" : "outline"}
            className={cn(
              "gap-2.5",
              image &&
                "rounded-[12px] w-[271px] h-[56px] font-medium transition-all shadow-md text-base",
            )}
          >
            {!image && <Icons.Refresh size={14} className="text-primary" />}
            {actionText}
            {image && (
              <span className="font-light text-3xl pb-[2px]">+</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
