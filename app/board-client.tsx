"use client";

import { useEffect } from "react";

export default function BoardClient() {
  useEffect(() => {
    // Board owns this isolated DOM subtree. Its module is evaluated only once,
    // and never on the server, including React's development double effect.
    void import("../vendor/board/src/main").catch((error) => {
      console.error("No se ha podido iniciar la pizarra", error);
      const root = document.getElementById("app");
      if (root && !root.querySelector("[data-startup-error]")) {
        const alert = document.createElement("div");
        alert.className = "dania-startup-error";
        alert.dataset.startupError = "true";
        alert.setAttribute("role", "alert");
        alert.textContent = "No se ha podido cargar la pizarra. Recarga la página para volver a intentarlo. Tus datos guardados no se han borrado.";
        root.querySelector(".dania-loading")?.remove();
        root.prepend(alert);
      }
    });
  }, []);

  return (
    <>
      <div id="app" suppressHydrationWarning>
        <div className="dania-loading" role="status">
          <strong>DanIA Táctica</strong>
          <span>Preparando tu pizarra…</span>
        </div>
      </div>
      <noscript>Activa JavaScript para utilizar la pizarra de fútbol.</noscript>
    </>
  );
}
