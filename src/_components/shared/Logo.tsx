import Image from "next/image";
import logo from "../../../public/icons/logo.png";
import { Text } from "@/_components/shared/Text";
import { ComponentProps } from "react";
import Link from "next/link";
/**
 *  Logo Component
 ** Props:
 * @param width - customizable width (default: 50)
 * @param height - customizable width (default: 50)
 * @param textSize - dynamic text sizing (example: sm, md, lg)
 * @param className - to add external classes if needed
 **  Example:
 * <Logo />
 * <Logo width={30} height={30} textSize="lg" />
 * <Logo width={120} height={120} textSize="6xl" className="flex-col" />
 */
type TextSize = ComponentProps<typeof Text>["size"];

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  textSize?: TextSize;
  imgClassName?: string;
  textClassName?: string;
}

const Logo = ({
  width = 50,
  height = 50,
  className,
  textSize = "3xl",
  imgClassName,
  textClassName,
}: LogoProps) => {
  return (
    <Link
      href={"/mailboxes"}
      className={`flex items-center gap-2 ${className}`}
    >
      <Image
        src={logo}
        alt="Logo"
        width={width}
        height={height}
        className={imgClassName}
      />
      <Text as={"h1"} font={"black"} size={textSize} className={textClassName}>
        SecureMail
      </Text>
    </Link>
  );
};

export default Logo;
