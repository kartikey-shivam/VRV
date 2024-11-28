import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from "@/lib/delimiters";
import { REGIONS } from "@/constants/region";
import { TAGS } from "@/constants/tag";
import { z } from "zod";
import { CurrencyCode } from "@/types/transaction/CurrencyCode";
import { TransactionType } from "@/types/transaction/TransactionType";
import { TransactionState } from "@/types/transaction/TransactionState";

// https://github.com/colinhacks/zod/issues/2985#issue-2008642190
const stringToBoolean = z
  .string()
  .toLowerCase()
  .transform((val) => {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  })
  .pipe(z.boolean().optional());

export const columnSchema = z.object({
  timestamp: z.date(),
  originAmountDetails: z.number().multipleOf(0.01).array().max(2).optional(),
  destinationAmountDetails: z.number().multipleOf(0.01).array().max(2).optional(),
  currencyCode: z.enum([...Object.values(CurrencyCode)] as [string, ...string[]]).array(),
  type: z.enum([...Object.values(TransactionType)] as [string, ...string[]]).array(),
  transactionState: z.enum([...Object.values(TransactionType)] as [string, ...string[]]).array(),
  originUserId: z.string(),
  destinationUserId: z.string(),
  transactionId: z.string(),
  description: z.string(),
  tags: z.string().array(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

export const columnFilterSchema = z.object({
  timestamp: z
    .string()
    .transform((val) => val.split(RANGE_DELIMITER).map(Number))
    .pipe(z.coerce.date().array())
    .optional(),
    originAmountDetails: z.string().optional(),
    destinationAmountDetails: z.string().optional(),
  currencyCode: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum([...Object.values(CurrencyCode)] as [string, ...string[]]).array())
    .optional(),
  type: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum([...Object.values(TransactionType)] as [string, ...string[]]).array())
    .optional(),
  transactionState: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum([...Object.values(TransactionState)] as [string, ...string[]]).array())
    .optional(),
  originUserId: z.string().optional(),
  destinationUserId: z.string().optional(),
  transactionId: z.string().optional(),
  description: z.string().optional(),
  tags: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum(TAGS).array())
    .optional(),
});

export type ColumnFilterSchema = z.infer<typeof columnFilterSchema>;
