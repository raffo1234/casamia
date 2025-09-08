import React from "react";

export default function New({ createdAt }: { createdAt: string }) {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const timeDifference = today.getTime() - createdDate.getTime();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

  if (timeDifference < oneWeekInMs) {
    return (
      <div className="bg-yellow-400 mb-2 text-xs uppercase rounded w-fit px-1 py-1 text-black">
        Nuevo
      </div>
    );
  }

  return null;
}
