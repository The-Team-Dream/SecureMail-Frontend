import { AuthSlides } from "@/_components/auth/AuthSlides";
import React from "react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-bgPrimary">
      {/* Form  */}
      <div className="flex flex-col items-center justify-center py-4">
        <section className="max-w-sm lg:max-w-lg w-full text-center lg:text-left">
          {children}
        </section>
      </div>
      {/* Sliders  */}
      <div className="hidden md:block sticky top-0 h-screen overflow-hidden">
        <AuthSlides />
      </div>
    </main>
  );
}
