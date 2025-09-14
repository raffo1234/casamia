"use client";

import { useEffect } from "react";

export default function ClientBg() {
  useEffect(() => {
    document.body.style.backgroundImage = `
      linear-gradient(
        to bottom,
        transparent,
        rgba(255, 255, 255, 1) 30%
      ),
      url("/bg-casamia.png")
    `;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
    };
  }, []);

  return null;
}
