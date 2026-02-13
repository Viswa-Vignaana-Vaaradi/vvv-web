"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type Payment = {
    id: string
    date: string
    amount: number
    receipt: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "S.No",
        header: "S.No"
    },
    {
        accessorKey: "Date",
        header: "Date"
    },
    {
        accessorKey: "Amount",
        header: "Amount"
    },
    {
        accessorKey: "Receipt",
        header: "Receipt"
    }
]