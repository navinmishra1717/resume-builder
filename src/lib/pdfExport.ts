/**
 * Exports the resume to PDF using the browser's native print dialog.
 * window.print() produces vector output (real text/paths), exact fidelity,
 * small file size, and respects CSS @media print page-break rules.
 */
export function exportToPDF(filename?: string): void {
  const prev = document.title;
  if (filename) {
    document.title = filename.replace(/\.pdf$/i, "");
  }
  window.print();
  setTimeout(() => {
    document.title = prev;
  }, 500);
}
