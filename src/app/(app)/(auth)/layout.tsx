import { AuthSlides } from "@/_components/AuthSlides";
import React from "react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-bgPrimary">
      {/* Form  */}
      <div className="flex flex-col items-center justify-center py-4 ">
        {children}
      </div>
      {/* Sliders */}
      <div className="hidden md:flex overflow-hidden">
        <AuthSlides />
      </div>
    </div>
  );
}
