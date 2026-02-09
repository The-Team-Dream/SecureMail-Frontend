import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className={`flex items-center  gap-2`}>
      <Image src={"/icons/logo_dark1.png"} alt="Logo" width={30} height={30} />
      <h1 className="text-3xl font-black">SecureMail</h1>
    </div>
  );
};

export default Logo;
