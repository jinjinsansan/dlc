"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-6 py-4 flex justify-between items-center bg-surface hover:bg-border/30 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="font-bold text-text-main">{item.question}</span>
            <span className="text-primary text-xl ml-4">
              {openIndex === i ? "−" : "+"}
            </span>
          </button>
          {openIndex === i && (
            <div className="px-6 py-4 text-text-muted leading-relaxed border-t border-border">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
