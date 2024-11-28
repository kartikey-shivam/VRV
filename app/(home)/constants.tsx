"use client";

import type {
  DataTableFilterField
} from "@/components/data-table/types";
import { CurrencyCode } from "@/types/transaction/CurrencyCode";
import { TransactionState } from "@/types/transaction/TransactionState";
import { TransactionType } from "@/types/transaction/TransactionType";
import { type ColumnSchema } from "./schema";

export const tagsColor = {
  DEPOSIT: {
    badge: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10",
    dot: "bg-[#10b981]",
  },
  TRANSFER: {
    badge: "text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10",
    dot: "bg-[#0ea5e9]",
  },
  EXTERNAL_PAYMENT: {
    badge: "text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/10",
    dot: "bg-[#8b5cf6]",
  },
  WITHDRAWAL: {
    badge: "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10",
    dot: "bg-[#f97316]",
  },
  REFUND: {
    badge: "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10",
    dot: "bg-[#ec4899]",
  },
  OTHER: {
    badge: "text-[#6b7280] bg-[#6b7280]/10 border-[#6b7280]/20 hover:bg-[#6b7280]/10",
    dot: "bg-[#6b7280]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

export const stateColors = {
  CREATED: {
    badge: "text-[#6b7280] bg-[#6b7280]/10 border-[#6b7280]/20 hover:bg-[#6b7280]/10",
    dot: "bg-[#6b7280]",
  },
  PROCESSING: {
    badge: "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20 hover:bg-[#eab308]/10",
    dot: "bg-[#eab308]",
  },
  SENT: {
    badge: "text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10",
    dot: "bg-[#0ea5e9]",
  },
  EXPIRED: {
    badge: "text-[#dc2626] bg-[#dc2626]/10 border-[#dc2626]/20 hover:bg-[#dc2626]/10",
    dot: "bg-[#dc2626]",
  },
  DECLINED: {
    badge: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20 hover:bg-[#ef4444]/10",
    dot: "bg-[#ef4444]",
  },
  SUSPENDED: {
    badge: "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10",
    dot: "bg-[#f97316]",
  },
  REFUNDED: {
    badge: "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10",
    dot: "bg-[#ec4899]",
  },
  SUCCESSFUL: {
    badge: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10",
    dot: "bg-[#10b981]",
  },
  REVERSED: {
    badge: "text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/10",
    dot: "bg-[#8b5cf6]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

export const filterFields = [ 
  {
    label: "Time Range",
    value: "timestamp",
    type: "timerange",
    defaultOpen: true,
    commandDisabled: true,
  },
  // {
  //   label: "P95",
  //   value: "p95",
  //   type: "slider",
  //   min: 0,
  //   // max: 3000,
  //   // options: data.map(({ p95 }) => ({ label: `${p95}`, value: p95 })),
  //   defaultOpen: true,
  // },
  {
    id: "originAmountDetails",
    label: "Amount Sent",
    value: "originAmountDetails",
    type: "input",
    inputType: "number",
    min: 0,
    step: "any",
    placeholder: "Enter amount",
    options: [{ label: "", value: "" }],
    defaultOpen: false,
  },
  {
    id: "destinationAmountDetails",
    label: "Amount Received",
    value: "destinationAmountDetails",
    type: "input",
    inputType: "number",
    min: 0,
    step: "any",
    placeholder: "Enter amount",
    options: [{ label: "", value: "" }],
    defaultOpen: false,
  },
  {
    label: "Currency Code",
    value: "currencyCode",
    type: "checkbox",
    options: Object.values(CurrencyCode).map((region) => ({
      label: region,
      value: region,
    })),
  },
  {
    label: "Transaction Type",
    value: "type",
    type: "checkbox",
    options: Object.values(TransactionType).map((region) => ({
      label: region,
      value: region,
    })),
  },
  {
    label: "Status",
    value: "transactionState",
    type: "checkbox",
    options: Object.values(TransactionState).map((region) => ({
      label: region,
      value: region,
    })),
  },
  // {
  //   label: "Host",
  //   value: "host",
  //   type: "input",
  //   options: [{ label: "", value: "" }], // REMINDER: this is a placeholder to set the type in the client.tsx
  // },
  {
    label: "Origin User ID",
    value: "originUserId",
    type: "input",
    inputType: "text",
    placeholder: "Enter origin user ID",
    options: [{ label: "", value: "" }],
  },
  {
    label: "Destination User ID",
    value: "destinationUserId",
    type: "input",
    inputType: "text",
    placeholder: "Enter destination user ID",
    options: [{ label: "", value: "" }],
  },
  {
    label: "Transaction ID",
    value: "transactionId",
    type: "input",
    inputType: "text",
    placeholder: "Enter transaction ID",
    options: [{ label: "", value: "" }],
  },
  {
    label: "Description",
    value: "description",
    type: "input",
    inputType: "text",
    placeholder: "Enter description",
    options: [{ label: "", value: "" }],
  },
  {
    label: "Tags",
    value: "tags",
    type: "input",
    inputType: "text",
    placeholder: "Enter tags",
    options: [{ label: "", value: "" }],
  },
] satisfies DataTableFilterField<ColumnSchema>[];