"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
        <PopoverTrigger 
            render={
                <Button variant={"outline"} data-empty={!date} className="data-[empty=true]:text-muted-foreground w-53 font-poppins justify-between text-left font-normal">
                    {date ? format(date, "PPP") : <span>Date of Birth</span>}
                    <ChevronDownIcon data-icon="inline-end" />
                </Button>}
            className="border-0 border-b bg-transparent border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-poppins font-medium text-[14px] mt-2 leading-8.25"
        />
        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
                captionLayout="dropdown"
                className="font-poppins"
            />
        </PopoverContent>
    </Popover>
  )
}
