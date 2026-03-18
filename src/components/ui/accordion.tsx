"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  className,
  ...props
}: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("overflow-hidden", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="contents">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex w-full items-start justify-between gap-3 rounded-2xl px-4 py-3 text-left outline-none transition-colors hover:bg-white/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 flex-1">{children}</span>
        <ChevronDown className="mt-1 size-4 shrink-0 text-slate-500 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn("overflow-hidden px-4 pb-4", className)}
      {...props}
    />
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
