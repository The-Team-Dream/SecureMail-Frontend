import React from "react";
import Link from "next/link";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-primary/90 px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      <div className="absolute -top-2 -left-2 -trnslate-x-1/2 w-[400px] h-[400px] bg-red-600/20 z-10 rounded-full blur-[100px] shadow-[0_0_150px_50px_rgba(239,68,68,0.2),inset_0_0_150px_50px_rgba(239,68,68,0.2)]" />
      <div className="text-center flex flex-col items-center justify-center z-99">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-x-icon lucide-circle-x"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <Text font={"semiBold"} className="text-[#ef4444] text-5xl">
            404
          </Text>
        </div>
        <Text
          as={"h1"}
          font={"semiBold"}
          className="text-background mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl"
        >
          Page not found
        </Text>
        <Text
          color={"primary-400"}
          font={"medium"}
          className="mt-6 text-lg font-medium text-pretty sm:text-xl/8"
        >
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </Text>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/">
            <Button
              size={"lg"}
              className="bg-secondary-500 hover:bg-secondary-700 text-black"
            >
              <Text as={"span"} font={"bold"} className="underline">
                Go back home
              </Text>
            </Button>
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold text-background group inline-flex hover:text-info-500"
          >
            Contact support{" "}
            <span
              className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
