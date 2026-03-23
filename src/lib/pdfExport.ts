/**
 * Exports a DOM element to a multi-page A4 PDF.
 *
 * Strategy:
 *  1. Clone the resume element into an off-screen container at native A4 width (794px)
 *     with no scaling transforms — so html2canvas sees the full, unscaled document.
 *  2. Inject a <style> block that forces rich-text list styles (since Tailwind compound
 *     selectors like [&_ul]:list-disc are NOT picked up by html2canvas).
 *  3. Capture the full height of the clone.
 *  4. Slice the canvas into A4-sized strips and add each as a new jsPDF page.
 */
export async function exportElementToPDF(
  element: HTMLDivElement,
  filename: string
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  const A4_WIDTH_PX = 794; // 210mm @ 96dpi

  // ── 1. Build off-screen container ──────────────────────────────────────
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "-9999px",
    width: `${A4_WIDTH_PX}px`,
    zIndex: "-1",
    background: "#ffffff",
    overflow: "visible",
  });

  // Deep-clone the resume node
  const clone = element.cloneNode(true) as HTMLDivElement;
  Object.assign(clone.style, {
    transform: "none",
    width: `${A4_WIDTH_PX}px`,
    minWidth: `${A4_WIDTH_PX}px`,
    maxWidth: `${A4_WIDTH_PX}px`,
    position: "relative",
    overflow: "visible",
  });

  // Inject styles that html2canvas can read (Tailwind compound selectors are not computed)
  const style = document.createElement("style");
  style.textContent = `
    /* Rich-text list rendering for PDF capture */
    .pdf-capture ul { list-style-type: disc !important; padding-left: 1.25rem !important; margin: 0.25rem 0 !important; }
    .pdf-capture ol { list-style-type: decimal !important; padding-left: 1.25rem !important; margin: 0.25rem 0 !important; }
    .pdf-capture li { display: list-item !important; margin-bottom: 0.125rem !important; }
    .pdf-capture a { text-decoration: underline !important; }
    .pdf-capture p { margin: 0 0 0.25rem 0 !important; }
    /* Force backgrounds to render */
    .pdf-capture * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  `;
  clone.classList.add("pdf-capture");

  container.appendChild(style);
  container.appendChild(clone);
  document.body.appendChild(container);

  // Wait one frame for layout to settle
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(clone, {
      scale: 2,             // 2× for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: A4_WIDTH_PX,
      height: clone.scrollHeight,
      windowWidth: A4_WIDTH_PX,
      windowHeight: clone.scrollHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    });
  } finally {
    document.body.removeChild(container);
  }

  // ── 2. Set up jsPDF at A4 ────────────────────────────────────────────
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidthMm = pdf.internal.pageSize.getWidth();   // 210 mm
  const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297 mm

  const canvasWidth = canvas.width;   // A4_WIDTH_PX * scale
  const canvasHeight = canvas.height; // full content height * scale

  // How many canvas pixels = one A4 page height?
  const pageHeightPx = Math.floor((pageHeightMm * canvasWidth) / pageWidthMm);
  const totalPages = Math.ceil(canvasHeight / pageHeightPx);

  // ── 3. Slice and add pages ───────────────────────────────────────────
  for (let page = 0; page < totalPages; page++) {
    const srcY = page * pageHeightPx;
    const srcH = Math.min(pageHeightPx, canvasHeight - srcY);

    const slice = document.createElement("canvas");
    slice.width = canvasWidth;
    slice.height = pageHeightPx; // full page height (last slice padded with white)
    const ctx = slice.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, srcY, canvasWidth, srcH, 0, 0, canvasWidth, srcH);

    const imgData = slice.toDataURL("image/png");
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, pageHeightMm);
  }

  pdf.save(filename);
}
