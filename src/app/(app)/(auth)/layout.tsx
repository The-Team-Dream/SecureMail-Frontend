import { AuthSlides } from "@/_components/AuthSlides";
import React from "react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Form  */}
      <div className="w-full lg:w-1/2 m-auto max-w-md lg:max-w-lg">
        {children}
      </div>
      {/* Sliders */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen">
        <AuthSlides />
      </div>
    </div>
  );
}
