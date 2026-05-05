"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b  last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  icon,
  rotateIcon = true,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  icon?: React.ReactNode;
  rotateIcon?: boolean;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none active:[data-state=open]:bg-primary-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          rotateIcon && "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        {icon || (
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 text-primary" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const updateState = () => {
      setIsOpen(element.getAttribute("data-state") === "open");
    };

    updateState();

    const observer = new MutationObserver(updateState);
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionPrimitive.Content
      ref={contentRef}
      forceMount
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -6,
        }}
        transition={{
          duration: 0.22,
          ease: "easeInOut",
        }}
        className={cn("overflow-hidden pt-0 pb-4", className)}
      >
        {children}
      </motion.div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
