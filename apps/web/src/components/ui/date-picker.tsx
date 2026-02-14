"use client";

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ selected, onSelect, onBlur, placeholder = "Date of Birth", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect?.(date);
    setOpen(false);
    onBlur?.();
  };

  React.useEffect(() => {
    if (!open) {
      onBlur?.();
    }
  }, [open, onBlur]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "data-[empty=true]:text-muted-foreground w-53 font-poppins justify-between text-left border-0 border-b bg-transparent border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-medium text-[14px] mt-2 leading-8.25",
          className
        )}
      >
        <span className="flex items-center justify-between w-full">
            {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected}
          captionLayout="dropdown"
          className="font-poppins"
        />
      </PopoverContent>
    </Popover>
  );
}