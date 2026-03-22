import { Link } from "react-router-dom";
import { ArrowRight, FileText, Layers, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Fast & Intuitive",
    desc: "Fill in your details with a clean form — no clutter, no distractions.",
  },
  {
    icon: Layers,
    title: "4 Beautiful Templates",
    desc: "Clasic, Minimal, Modern, and Creative. Switch instantly, preview in real-time.",
  },
  {
    icon: Download,
    title: "Export as PDF",
    desc: "One click to download a print-ready A4 PDF of your resume.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <FileText className="w-5 h-5 text-primary" />
            <span>Resume Builder</span>
          </div>
          <Button size="sm" asChild>
            <Link to="/create">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-6">
          <Zap className="w-3 h-3" />
          Free · No sign-up required
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground max-w-2xl leading-none mb-5">
          Create professional
          <br />
          <span className="text-primary">resumes in minutes</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-md mb-8">
          Fill in your details, pick a template, and download a polished A4 PDF
          — all in your browser.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" asChild className="gap-2 px-8 text-base h-12">
            <Link to="/create">
              Create My Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="px-8 text-base h-12"
          >
            <Link to="/preview">Preview</Link>
          </Button>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 w-full max-w-3xl mx-auto">
          <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 flex items-center gap-1.5 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <span className="text-xs text-muted-foreground ml-2 font-mono">
                resume-builder.app/create
              </span>
            </div>
            <div className="p-8 flex gap-6">
              {/* Form mockup */}
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-8 bg-muted/70 border border-border rounded-md" />
                <div className="h-8 bg-muted/70 border border-border rounded-md" />
                <div className="h-16 bg-muted/70 border border-border rounded-md mt-2" />
                <div className="h-3 bg-muted rounded w-1/4 mt-3" />
                <div className="flex gap-2">
                  {["Experience", "Skills", "Projects"].map((s) => (
                    <div
                      key={s}
                      className="h-6 px-3 bg-accent rounded-full flex items-center"
                    >
                      <span className="text-[10px] text-accent-foreground font-medium">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Preview mockup */}
              <div className="w-40 bg-white border border-border rounded-lg p-3 space-y-2 shrink-0">
                <div className="h-3 bg-foreground/80 rounded w-2/3" />
                <div className="h-1.5 bg-muted rounded w-1/2" />
                <div className="h-px bg-border my-2" />
                <div className="space-y-1">
                  <div className="h-1.5 bg-primary/30 rounded w-1/3" />
                  <div className="h-1.5 bg-muted rounded w-full" />
                  <div className="h-1.5 bg-muted rounded w-4/5" />
                </div>
                <div className="space-y-1 mt-2">
                  <div className="h-1.5 bg-primary/30 rounded w-1/4" />
                  <div className="h-1.5 bg-muted rounded w-full" />
                  <div className="h-1.5 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="text-left p-5 bg-surface border border-border rounded-lg"
            >
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        Resume Builder — All data is stored locally in your browser.
      </footer>
    </div>
  );
}
