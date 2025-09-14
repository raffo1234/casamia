"use client";

import { useEffect } from "react";

export default function ClientBg() {
  useEffect(() => {
    document.body.style.backgroundImage = `
      linear-gradient(
        to bottom,
        transparent,
        rgba(255, 255, 255, 1) 80%
      ),
      url("/bg-casamia.png")
    `;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
    };
  }, []);

  return null;
}
