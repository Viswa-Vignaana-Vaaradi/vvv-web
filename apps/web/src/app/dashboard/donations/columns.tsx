"use client";
import { type ColumnDef } from "@tanstack/react-table";

export type Payment = {
    id: string;
    sNo: number;
    date: string;
    amount: number;
    receipt: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "sNo",
        header: "S.No.",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "amount",
        header: "Amount (₹)",
        cell: ({ row }) => `₹${row.original.amount}`,
    },
    // Receipt is hidden/commented as requested
    /* {
        accessorKey: "receipt",
        header: "Receipt",
    } */
];
