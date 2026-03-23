/**
 * Exports a DOM element to a multi-page A4 PDF.
 *
 * Strategy:
 *  1. Temporarily remove any CSS transform (scale) from the element so
 *     html2canvas captures it at its true A4 pixel width (794 px).
 *  2. Capture the full scrollable height of the element.
 *  3. Slice the canvas into A4-sized strips and add each as a new page.
 */
export async function exportElementToPDF(
  element: HTMLDivElement,
  filename: string
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  // ── 1. Strip transform so we capture at native A4 size ───────────────
  const prevTransform = element.style.transform;
  const prevPosition = element.style.position;

  element.style.transform = "none";
  // Keep it in flow during capture to preserve full height
  element.style.position = "relative";

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,           // 2× for crisp text
      useCORS: true,
      backgroundColor: "#ffffff",
      // Capture full element height (multi-page resumes)
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
  } finally {
    // Always restore original styles
    element.style.transform = prevTransform;
    element.style.position = prevPosition;
  }

  // ── 2. Set up jsPDF at A4 ────────────────────────────────────────────
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidthMm = pdf.internal.pageSize.getWidth();   // 210 mm
  const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297 mm

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // How many canvas pixels equal one page height?
  // pageWidthMm / canvasWidth = mm per px  →  pageHeightPx = pageHeightMm / (mm per px)
  const pageHeightPx = Math.floor((pageHeightMm * canvasWidth) / pageWidthMm);
  const totalPages = Math.ceil(canvasHeight / pageHeightPx);

  // ── 3. Slice and add pages ───────────────────────────────────────────
  for (let page = 0; page < totalPages; page++) {
    const srcY = page * pageHeightPx;
    const srcH = Math.min(pageHeightPx, canvasHeight - srcY);

    // Draw the slice onto a temporary canvas
    const slice = document.createElement("canvas");
    slice.width = canvasWidth;
    slice.height = pageHeightPx; // always full page height (last slice padded)
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
