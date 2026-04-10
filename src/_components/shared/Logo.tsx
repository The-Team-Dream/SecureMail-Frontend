import Image from "next/image";
import { Text } from "./Text";

const Logo = () => {
  return (
    <div className={`flex items-center gap-2`}>
      <Image src={"/icons/logo.png"} alt="Logo" width={50} height={50} />
      <Text as={"h1"} font={"black"} size={"3xl"}>
        SecureMail
      </Text>
    </div>
  );
};

export default Logo;
