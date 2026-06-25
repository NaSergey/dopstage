"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils/css"
import { AccordionChevronIcon } from "@/shared/ui/icons"

interface AccordionItemProps {
  question: string
  answer: string
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ question, answer, isOpen = false, onToggle, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-zinc-800 py-1.5 first:pt-0 last:border-b-0 last:pb-0 cursor-pointer",
          className
        )}
        onClick={onToggle}
        {...props}
      >
        <div className="w-full flex items-center justify-center gap-4 text-left group">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
              {question}
            </h3>
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isOpen ? "max-h-[1000px]" : "max-h-10"
              )}
            >
              <div className="pt-4">
                <p
                  className={cn(
                    "text-zinc-600 text-sm leading-relaxed",
                    !isOpen && "line-clamp-1"
                  )}
                >
                  {answer}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center pt-0.5">
            <AccordionChevronIcon
              className={cn(
                "transition-transform duration-200 h-1.5 w-1.5 scale-300",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
        </div>
      </div>
    )
  }
)

AccordionItem.displayName = "AccordionItem"

interface AccordionProps {
  items: Array<{
    id: string
    question: string
    answer: string
  }>
  defaultOpenId?: string
  className?: string
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, defaultOpenId, className, ...props }, ref) => {
    const [openItemId, setOpenItemId] = React.useState<string | null>(defaultOpenId || null)

    const handleToggle = (id: string) => {
      setOpenItemId(openItemId === id ? null : id)
    }

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={openItemId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    )
  }
)

Accordion.displayName = "Accordion"

export { Accordion, AccordionItem }
