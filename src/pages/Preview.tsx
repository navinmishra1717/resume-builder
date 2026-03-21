import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResume } from "@/store/ResumeContext";
import { TemplateId } from "@/types/resume";
import ResumeRenderer from "@/components/templates/ResumeRenderer";

const templates: { id: TemplateId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
];

export default function Preview() {
  const { data, setTemplate } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);

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
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.personalInfo.name || "resume"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border print:hidden">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-muted-foreground"
          >
            <Link to="/create">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Editor
            </Link>
          </Button>

          <div className="flex items-center gap-2 font-semibold ml-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm">Resume Preview</span>
          </div>

          {/* Template switcher */}
          <div className="ml-auto flex items-center gap-1 bg-muted rounded-lg p-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-1 text-xs rounded-md transition-colors font-medium ${data.selectedTemplate === t.id ? "bg-surface text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* A4 preview */}
      <main className="flex-1 flex justify-center py-8 px-4 print:py-0 print:px-0">
        <div
          ref={previewRef}
          id="resume-preview"
          className="bg-white shadow-resume print:shadow-none"
          style={{ width: "210mm", minHeight: "297mm" }}
        >
          <ResumeRenderer data={data} />
        </div>
      </main>
    </div>
  );
}
