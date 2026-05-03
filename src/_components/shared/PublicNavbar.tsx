"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

interface PublicNavbarProps {
  backLink: string;
  backLabel: string;
}

const PublicNavbar = ({ backLink, backLabel }: PublicNavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary-100/10 py-4 px-6 md:px-12 flex items-center justify-between">
      <Logo />
      <Link href={backLink}>
        <Button
          variant={"secondary"}
          className={`transition-colors gap-2 hover:underline`}
        >
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </Button>
      </Link>
    </nav>
  );
};

export default PublicNavbar;
