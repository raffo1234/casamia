"use client";

import { TransactionType } from "@/types/TransactionType";

export default function TransactionTypes({
  selectedType,
  onSelect,
}: {
  selectedType: TransactionType | null;
  onSelect: (type: TransactionType) => void;
}) {
  return (
    <div className="flex space-x-2 p-1 rounded-full w-fit mx-auto mb-2">
      {Object.values(TransactionType).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={`
            px-4 py-2 rounded-full text-sm capitalize transition-colors duration-200
            ${
              selectedType === type
                ? "bg-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }
          `}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
