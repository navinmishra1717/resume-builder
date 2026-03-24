import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResume } from "@/store/ResumeContext";
import { TemplateId } from "@/types/resume";
import ResumeRenderer from "@/components/templates/ResumeRenderer";
import { generateDocx } from "@/lib/docxExport";
import { exportToPDF } from "@/lib/pdfExport";

const A4_WIDTH_PX = 794;  // 210mm at 96dpi
const A4_HEIGHT_PX = 1123; // 297mm at 96dpi

const templates: { id: TemplateId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
];

function useContainerScale(padding = 32) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const available = window.innerWidth - padding;
      setScale(Math.min(1, available / A4_WIDTH_PX));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [padding]);
  return scale;
}

/** Dashed lines at every A4-page boundary so users see exactly where PDF will break. */
function PageBreakOverlay({ contentHeight, scale }: { contentHeight: number; scale: number }) {
  const pageCount = Math.ceil(contentHeight / A4_HEIGHT_PX);
  if (pageCount <= 1) return null;
  return (
    <>
      {Array.from({ length: pageCount - 1 }, (_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{ top: A4_HEIGHT_PX * (i + 1) * scale, borderTop: "2px dashed #94a3b8" }}
        >
          <span
            className="absolute right-0 text-[9px] font-medium px-1.5 py-0.5 rounded-bl-md"
            style={{ background: "#94a3b8", color: "#fff", top: 0, transform: "translateY(-100%)" }}
          >
            Page {i + 1} / {pageCount}
          </span>
        </div>
      ))}
    </>
  );
}

export default function Preview() {
  const { data, setTemplate } = useResume();
  const contentRef = useRef<HTMLDivElement>(null);
  const scale = useContainerScale(32);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);

  useEffect(() => {
    if (!contentRef.current) return;
    const obs = new ResizeObserver(() => {
      setContentHeight(contentRef.current?.scrollHeight ?? A4_HEIGHT_PX);
    });
    obs.observe(contentRef.current);
    return () => obs.disconnect();
  }, []);

  const handleDownloadPDF = () => {
    exportToPDF(data.personalInfo.name || "resume");
  };

  const scaledWidth = A4_WIDTH_PX * scale;
  const scaledHeight = contentHeight * scale;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border print:hidden">
        <div className="max-w-screen-lg mx-auto px-3 sm:px-4 py-2 sm:py-0 sm:h-14 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground shrink-0">
              <Link to="/create">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Editor</span>
              </Link>
            </Button>
            <div className="flex items-center gap-1.5 font-semibold">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm whitespace-nowrap">Resume Preview</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto sm:hidden">
              <Button variant="outline" size="sm" onClick={() => generateDocx(data)} className="gap-1 px-2 text-xs">
                <FileDown className="w-3.5 h-3.5" />DOCX
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} className="gap-1 px-2 text-xs">
                <Download className="w-3.5 h-3.5" />PDF
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1 flex-1 sm:flex-none overflow-x-auto">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors font-medium whitespace-nowrap flex-1 sm:flex-none ${
                    data.selectedTemplate === t.id
                      ? "bg-surface text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => generateDocx(data)} className="gap-1.5">
                <FileDown className="w-3.5 h-3.5" />Download DOCX
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Pages Preview ── */}
      <main className="flex-1 flex justify-center py-6 px-2 sm:px-4 print:py-0 print:px-0">
        <div
          className="relative print:w-auto print:h-auto"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <PageBreakOverlay contentHeight={contentHeight} scale={scale} />
          <div
            ref={contentRef}
            id="resume-preview"
            className="origin-top-left bg-white shadow-resume print:shadow-none print:transform-none"
            style={{
              width: "210mm",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <ResumeRenderer data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
