"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

interface MonthYearPickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

export default function MonthYearPicker({
  value,
  onChange,
}: MonthYearPickerProps) {
  return (
    <DatePicker
      selected={value}
      onChange={(date) => {
        onChange?.(date);
      }}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      locale="es"
      minDate={new Date()}
      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 
                focus:outline-none focus:ring-4 focus:ring-cyan-100 
                focus:border-cyan-500"
    />
  );
}
