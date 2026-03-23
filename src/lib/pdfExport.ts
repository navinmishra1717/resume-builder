/**
 * Exports a DOM element to a multi-page A4 PDF.
 *
 * Strategy:
 *  1. Clone the resume element into an off-screen container at native A4 width (794 px)
 *     with all transforms removed — so html2canvas captures the full unscaled document.
 *  2. Inject a <style> block that forces rich-text list styles (Tailwind compound
 *     selectors like [&_ul]:list-disc are NOT computed by html2canvas).
 *  3. Capture the full clone height.
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
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "absolute",
    top: "0",
    left: "-9999px",
    width: `${A4_WIDTH_PX}px`,
    overflow: "visible",
    background: "#ffffff",
    zIndex: "0",
  });

  // Deep-clone the resume node and strip any scaling
  const clone = element.cloneNode(true) as HTMLDivElement;
  Object.assign(clone.style, {
    transform: "none",
    width: `${A4_WIDTH_PX}px`,
    minWidth: `${A4_WIDTH_PX}px`,
    maxWidth: `${A4_WIDTH_PX}px`,
    position: "relative",
    overflow: "visible",
    minHeight: "unset",
    height: "auto",
  });

  // Inject explicit styles for rich-text elements that Tailwind compound
  // selectors don't cover during canvas rendering
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .pdf-clone ul { list-style-type: disc !important; padding-left: 1.25rem !important; margin: 0.25rem 0 !important; }
    .pdf-clone ol { list-style-type: decimal !important; padding-left: 1.25rem !important; margin: 0.25rem 0 !important; }
    .pdf-clone li { display: list-item !important; margin-bottom: 0.125rem !important; }
    .pdf-clone a { text-decoration: underline !important; }
    .pdf-clone * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  `;
  clone.classList.add("pdf-clone");

  wrapper.appendChild(styleEl);
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Let the browser lay out the cloned DOM before measuring
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );

  const contentHeight = clone.scrollHeight;

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: A4_WIDTH_PX,
      height: contentHeight,
      windowWidth: A4_WIDTH_PX,
      windowHeight: contentHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      // Ignore elements that should not appear in PDF
      ignoreElements: (el) =>
        el.classList?.contains("print:hidden") || false,
    });
  } finally {
    document.body.removeChild(wrapper);
  }

  // ── 2. Set up jsPDF at A4 ────────────────────────────────────────────
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidthMm = pdf.internal.pageSize.getWidth();   // 210 mm
  const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297 mm

  const canvasWidth = canvas.width;   // A4_WIDTH_PX * scale (= 1588)
  const canvasHeight = canvas.height; // full content height * scale

  // How many canvas pixels = one A4 page height?
  const pageHeightPx = Math.floor((pageHeightMm * canvasWidth) / pageWidthMm);
  const totalPages = Math.ceil(canvasHeight / pageHeightPx);

  // ── 3. Slice canvas into pages and build PDF ─────────────────────────
  for (let page = 0; page < totalPages; page++) {
    const srcY = page * pageHeightPx;
    const srcH = Math.min(pageHeightPx, canvasHeight - srcY);

    // Draw this page's slice onto a temporary canvas (pad last page with white)
    const slice = document.createElement("canvas");
    slice.width = canvasWidth;
    slice.height = pageHeightPx;
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
