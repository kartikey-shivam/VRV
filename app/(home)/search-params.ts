import {
  createParser,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  parseAsTimestamp,
} from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive
import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from "@/lib/delimiters";
import { REGIONS } from "@/constants/region";
import { TAGS } from "@/constants/tag";
import { CurrencyCode } from "@/types/transaction/CurrencyCode";
import { TransactionState } from "@/types/transaction/TransactionState";
import { TransactionType } from "@/types/transaction/TransactionType";

export const parseAsSort = createParser({
  parse(queryValue) {
    const [id, desc] = queryValue.split(".");
    if (!id && !desc) return null;
    return { id, desc: desc === "desc" };
  },
  serialize(value) {
    return `${value.id}.${value.desc ? "desc" : "asc"}`;
  },
});

export const searchParamsParser = {
  timestamp: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER),
  originAmountDetails: parseAsString,
  destinationAmountDetails: parseAsString,
  currencyCode: parseAsArrayOf(parseAsStringLiteral(Object.values(CurrencyCode)), ARRAY_DELIMITER),
  type: parseAsArrayOf(parseAsStringLiteral(Object.values(TransactionType)), ARRAY_DELIMITER),
  transactionState: parseAsArrayOf(parseAsStringLiteral(Object.values(TransactionState)), ARRAY_DELIMITER),
  originUserId: parseAsString,
  destinationUserId: parseAsString,
  transactionId: parseAsString,
  description: parseAsString,
  tags: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParser);
