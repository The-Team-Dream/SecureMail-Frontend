import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get("token");
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.replace("/sign-in");
    }
  }, [token, router]);
  return <>{children}</>;
};

export default ProtectedRoute;
