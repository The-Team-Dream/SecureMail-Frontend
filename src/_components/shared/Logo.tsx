import Image from "next/image";
import { Text } from "./Text";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ width = 50, height = 50, className }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src={"/icons/logo.png"} alt="Logo" width={width} height={height} />
      <Text as={"h1"} font={"black"} size={"3xl"}>
        SecureMail
      </Text>
    </div>
  );
};

export default Logo;
