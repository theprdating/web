"use client";

/**
 * Renders two diagonal corner watercolor accents (fixed to viewport).
 * Files are expected at /illustrations/decorations/corner-tr.png and corner-bl.png.
 * If files don't exist, the divs simply render empty (no broken icons).
 * Use background-image (not <img>) so missing files fail silently.
 */
export default function DecorativeBackground() {
  return (
    <>
      <div
        aria-hidden
        className="fixed top-0 right-0 w-[260px] h-[260px] pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage: "url(/illustrations/decorations/corner-tr.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
        }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 left-0 w-[260px] h-[260px] pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage: "url(/illustrations/decorations/corner-bl.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom left",
        }}
      />
    </>
  );
}
