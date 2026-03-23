/**
 * Exports the resume to PDF using the browser's native print dialog.
 *
 * Why window.print() beats html2canvas + jsPDF for resumes:
 *  - Perfect fidelity: browser renders its own DOM — fonts/layout match preview exactly
 *  - Vector output: real text and paths, not a rasterized image → ~50–150 KB
 *  - Native page breaks via CSS (no canvas-slicing hacks)
 *  - Zero extra dependencies
 *
 * The filename defaults to document.title in most browsers when the user
 * chooses "Save as PDF" in the print dialog.
 */
export function exportToPDF(filename?: string): void {
  const prev = document.title;
  if (filename) {
    // Strip .pdf extension — browser appends it automatically on Save as PDF
    document.title = filename.replace(/\.pdf$/i, "");
  }
  window.print();
  // Restore after a short delay so the print dialog has already read the title
  setTimeout(() => {
    document.title = prev;
  }, 500);
}
