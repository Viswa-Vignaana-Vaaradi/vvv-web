"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react" // Added Check icon
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValue = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue]
    onChange(newValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-0 border-b rounded-none shadow-none px-0 bg-primary font-poppins font-medium text-[14px] h-10", 
            className
          )}
        >
          <span className="truncate text-foreground/70">
            {value.length > 0
              ? `${value.length} selected`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      } />
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." className="font-poppins h-9" />
          <CommandList className="max-h-75">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="font-poppins cursor-pointer flex items-center gap-2 px-2 py-2"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-colors hover:text-white",
                        isSelected 
                          ? "bg-[#DB7A05] text-white hover:text-white"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-3 w-3 font-bold")} />
                    </div>
                    
                    <span className="flex-1 truncate">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
