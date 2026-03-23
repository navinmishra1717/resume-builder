import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  FileText,
  Download,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResume } from "@/store/ResumeContext";
import { SectionVisibility, TemplateId } from "@/types/resume";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import SummaryForm from "@/components/forms/SummaryForm";
import EducationForm from "@/components/forms/EducationForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import HobbiesForm from "@/components/forms/HobbiesForm";
import LinksForm from "@/components/forms/LinksForm";
import ResumeRenderer from "@/components/templates/ResumeRenderer";
import { generateDocx } from "@/lib/docxExport";
import { exportToPDF } from "@/lib/pdfExport";

type SectionKey = keyof SectionVisibility;

interface SectionConfig {
  key: SectionKey;
  label: string;
}

const sections: SectionConfig[] = [
  { key: "personalInfo", label: "Personal Info" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "hobbies", label: "Hobbies & Interests" },
  { key: "links", label: "Links" },
];

const templates: { id: TemplateId; label: string; desc: string }[] = [
  { id: "classic", label: "Classic", desc: "Document style, serif font" },
  { id: "minimal", label: "Minimal", desc: "Clean, timeless, ATS-friendly" },
  { id: "modern", label: "Modern", desc: "Two-column with sidebar" },
  { id: "creative", label: "Creative", desc: "Bold, colorful, standout" },
];

function SectionCard({
  title,
  visible,
  onToggle,
  children,
  defaultOpen = false,
}: {
  title: string;
  visible: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="section-card overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="font-semibold text-sm text-foreground">{title}</span>
        </div>
        <button
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
            visible
              ? "text-primary bg-accent"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title={visible ? "Hide section" : "Show section"}
        >
          {visible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
          {visible ? "Visible" : "Hidden"}
        </button>
      </div>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Create() {
  const store = useResume();
  const { data } = store;
  const previewRef = useRef<HTMLDivElement>(null);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const handleDownloadPDF = () => {
    exportToPDF(data.personalInfo.name || "resume");
  };

  const handleDownloadDocx = async () => {
    await generateDocx(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-foreground shrink-0"
          >
            <FileText className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">Resume Builder</span>
          </Link>

          {/* Mobile Edit/Preview tabs */}
          <div className="flex md:hidden gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setMobileTab("edit")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                mobileTab === "edit"
                  ? "bg-surface text-foreground shadow-card font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                mobileTab === "preview"
                  ? "bg-surface text-foreground shadow-card font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDocx}
              className="gap-1 sm:gap-1.5 px-2 sm:px-3"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download </span>DOCX
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-1 sm:gap-1.5 px-2 sm:px-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download </span>PDF
            </Button>
            <Link
              to="/preview"
              className="text-xs text-primary hover:underline hidden md:inline whitespace-nowrap"
            >
              Full preview →
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 max-w-screen-xl mx-auto w-full flex flex-col md:flex-row gap-0 md:gap-6 px-3 sm:px-4 py-4 sm:py-6">
        {/* Left: Form pane */}
        <div
          className={`flex-1 min-w-0 space-y-3 ${
            mobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          {/* Template picker */}
          <div className="section-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Template
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => store.setTemplate(t.id)}
                  className={`p-3 rounded-md border text-left transition-all ${
                    data.selectedTemplate === t.id
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      data.selectedTemplate === t.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {t.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Section forms */}
          {sections.map((s) => (
            <SectionCard
              key={s.key}
              title={s.label}
              visible={data.sectionVisibility[s.key]}
              onToggle={() => store.toggleSection(s.key)}
              defaultOpen={s.key === "personalInfo"}
            >
              {s.key === "personalInfo" && (
                <PersonalInfoForm
                  data={data.personalInfo}
                  onChange={store.updatePersonalInfo}
                />
              )}
              {s.key === "summary" && (
                <SummaryForm
                  data={data.summary}
                  onChange={store.updateSummary}
                />
              )}
              {s.key === "education" && (
                <EducationForm
                  entries={data.education}
                  onAdd={store.addEducation}
                  onUpdate={store.updateEducation}
                  onRemove={store.removeEducation}
                />
              )}
              {s.key === "experience" && (
                <ExperienceForm
                  entries={data.experience}
                  onAdd={store.addExperience}
                  onUpdate={store.updateExperience}
                  onRemove={store.removeExperience}
                />
              )}
              {s.key === "skills" && (
                <SkillsForm
                  entries={data.skills}
                  onAdd={store.addSkillCategory}
                  onUpdate={store.updateSkillCategory}
                  onRemove={store.removeSkillCategory}
                />
              )}
              {s.key === "projects" && (
                <ProjectsForm
                  entries={data.projects}
                  onAdd={store.addProject}
                  onUpdate={store.updateProject}
                  onRemove={store.removeProject}
                />
              )}
              {s.key === "certifications" && (
                <CertificationsForm
                  entries={data.certifications}
                  onAdd={store.addCertification}
                  onUpdate={store.updateCertification}
                  onRemove={store.removeCertification}
                />
              )}
              {s.key === "hobbies" && (
                <HobbiesForm
                  entries={data.hobbies}
                  onAdd={store.addHobby}
                  onUpdate={store.updateHobby}
                  onRemove={store.removeHobby}
                />
              )}
              {s.key === "links" && (
                <LinksForm
                  entries={data.links ?? []}
                  onAdd={store.addLink}
                  onUpdate={store.updateLink}
                  onRemove={store.removeLink}
                />
              )}
            </SectionCard>
          ))}
        </div>

        {/* Right: Live preview */}
        <div
          className={`md:w-[42%] lg:w-[40%] shrink-0 ${
            mobileTab === "edit" ? "hidden md:block" : "block w-full"
          }`}
        >
          <div className="md:sticky md:top-20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Live Preview
              </p>
              <Link
                to="/preview"
                className="text-xs text-primary hover:underline"
              >
                Full preview →
              </Link>
            </div>

            {/* Scaled preview container */}
            <div className="bg-border rounded-lg overflow-hidden">
              {/*
                We use a CSS custom property trick:
                The inner div is 210mm wide (A4), scaled down to fit.
                On mobile the tab shows the preview full-width, so we scale
                to roughly 65% of the container. On desktop the sidebar is fixed.
              */}
              <div
                className="relative w-full"
                style={{ paddingBottom: "calc(297mm * 0.65 / 210mm * 100%)" }}
              >
                <div
                  ref={previewRef}
                  id="resume-preview"
                  className="absolute top-0 left-0 origin-top-left bg-white"
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    transform: "scale(0.65)",
                    transformOrigin: "top left",
                  }}
                >
                  <ResumeRenderer data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden print:block" aria-hidden="true">
        <ResumeRenderer data={data} />
      </div>
    </div>
  );
}
