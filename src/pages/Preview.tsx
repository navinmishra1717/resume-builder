import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResume } from "@/store/ResumeContext";
import { TemplateId } from "@/types/resume";
import ResumeRenderer from "@/components/templates/ResumeRenderer";
import { generateDocx } from "@/lib/docxExport";
import { exportElementToPDF } from "@/lib/pdfExport";

const A4_WIDTH_PX = 794; // 210mm at 96dpi

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

export default function Preview() {
  const { data, setTemplate } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const scale = useContainerScale(32);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.personalInfo.name || "resume"}.pdf`);
  };

  // Scaled height so the outer container doesn't collapse
  const scaledHeight = `calc(297mm * ${scale})`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border print:hidden">
        <div className="max-w-screen-lg mx-auto px-3 sm:px-4 py-2 sm:py-0 sm:h-14 flex flex-col sm:flex-row sm:items-center gap-2">

          {/* Row 1 (mobile) / inline (desktop): back + title + mobile download buttons */}
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

            {/* Mobile-only compact download buttons */}
            <div className="flex items-center gap-1.5 ml-auto sm:hidden">
              <Button variant="outline" size="sm" onClick={() => generateDocx(data)} className="gap-1 px-2 text-xs">
                <FileDown className="w-3.5 h-3.5" />
                DOCX
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} className="gap-1 px-2 text-xs">
                <Download className="w-3.5 h-3.5" />
                PDF
              </Button>
            </div>
          </div>

          {/* Row 2 (mobile) / inline (desktop): template switcher + desktop download */}
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

            {/* Desktop-only full-label buttons */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => generateDocx(data)} className="gap-1.5">
                <FileDown className="w-3.5 h-3.5" />
                Download DOCX
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── A4 Preview ── */}
      <main className="flex-1 flex justify-center py-6 px-2 sm:px-4 print:py-0 print:px-0">
        {/*
          The A4 sheet is 210mm (~794px). On small screens we scale it down
          so it fits the viewport while keeping print output at 100%.
        */}
        <div
          className="relative print:w-auto print:h-auto"
          style={{ width: A4_WIDTH_PX * scale, height: scaledHeight }}
        >
          <div
            ref={previewRef}
            id="resume-preview"
            className="absolute top-0 left-0 origin-top-left bg-white shadow-resume print:shadow-none print:transform-none print:static"
            style={{
              width: "210mm",
              minHeight: "297mm",
              transform: `scale(${scale})`,
            }}
          >
            <ResumeRenderer data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
