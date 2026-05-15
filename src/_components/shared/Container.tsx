import React from "react";
import { cn } from "@/lib/utils";

const Container = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("mx-6 my-8", className)}>{children}</div>;
};

export default Container;
