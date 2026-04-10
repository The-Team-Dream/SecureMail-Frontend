import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
interface SocialAuthButtonProps {
  provider: "google" | "outlook";
  title: string;
  iconSrc: string;
  isLoading?: boolean;
  onClick: (provider: string) => void;
}

export const SocialAuthButton = ({
  provider,
  title,
  iconSrc,
  isLoading,
  onClick,
}: SocialAuthButtonProps) => {
  return (
    <Button
      type="submit"
      size={"lg"}
      variant={"outline"}
      className={`rounded-xl`}
      onClick={() => onClick(provider)}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Image src={iconSrc} width={30} height={30} alt={`${title} icon`} />
      )}
      <span>{isLoading ? "Connecting..." : title}</span>
    </Button>
  );
};
