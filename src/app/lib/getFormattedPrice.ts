import { currencySymbols } from "@/types/propertyState";
import { numericFormatter } from "react-number-format";

export const getFormattedPrice = (
  currencyCode: string | undefined,
  price: string | undefined
) => {
  if (price === undefined || price === null) {
    return "";
  }

  const displaySymbol = currencyCode ? currencySymbols[currencyCode] : "";

  return numericFormatter(price, {
    thousandSeparator: ",",
    decimalSeparator: ".",
    decimalScale: 2,
    prefix: displaySymbol ? `${displaySymbol} ` : "",
  });
};
