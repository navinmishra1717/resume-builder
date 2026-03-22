import { ResumeData } from "@/types/resume";
import { saveAs } from "file-saver";

// Strip HTML tags, keeping newlines for paragraphs/list items
function htmlToPlainLines(html: string): string[] {
  if (!html) return [];
  return html
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function plain(html: string): string {
  return htmlToPlainLines(html).join(" ");
}

export async function generateDocx(data: ResumeData): Promise<void> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    ExternalHyperlink,
  } = await import("docx");

  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    hobbies,
    links,
    sectionVisibility,
  } = data;

  const LEVEL_ORDER = ["Expert", "Experienced", "Skillful", "Beginner"];

  // Reusable styles
  const sectionHeading = (text: string) =>
    new Paragraph({
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 22,
          font: "Calibri",
          color: "1a1a1a",
        }),
      ],
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 4 },
      },
      spacing: { before: 240, after: 100 },
    });

  const bodyText = (text: string, opts?: { bold?: boolean; italic?: boolean; size?: number }) =>
    new Paragraph({
      children: [
        new TextRun({
          text,
          bold: opts?.bold,
          italics: opts?.italic,
          size: opts?.size ?? 20,
          font: "Calibri",
        }),
      ],
      spacing: { after: 60 },
    });

  const children: (typeof Paragraph.prototype)[] = [];

  // ── Name & Contact ──────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.name || "Your Name",
          bold: true,
          size: 40,
          font: "Calibri",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join("  ·  "), size: 18, font: "Calibri", color: "555555" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );
  }

  // ── Links ────────────────────────────────────────────────────────────
  if (sectionVisibility.links && links && links.length > 0) {
    const linkRuns = links
      .filter((l) => l.name || l.link)
      .flatMap((l, i) => [
        new ExternalHyperlink({
          link: l.link || "#",
          children: [
            new TextRun({ text: l.name || l.link, style: "Hyperlink", size: 18, font: "Calibri" }),
          ],
        }),
        ...(i < links.length - 1
          ? [new TextRun({ text: "  ·  ", size: 18, font: "Calibri", color: "888888" })]
          : []),
      ]);
    children.push(
      new Paragraph({ children: linkRuns, alignment: AlignmentType.CENTER, spacing: { after: 120 } })
    );
  }

  // ── Summary ──────────────────────────────────────────────────────────
  if (sectionVisibility.summary && summary) {
    children.push(sectionHeading("Profile"));
    htmlToPlainLines(summary).forEach((line) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: 20, font: "Calibri" })],
          spacing: { after: 60 },
        })
      );
    });
  }

  // ── Experience ───────────────────────────────────────────────────────
  if (sectionVisibility.experience && experience.length > 0) {
    children.push(sectionHeading("Experience"));
    experience.forEach((exp) => {
      const dateStr = [exp.startDate, exp.current ? "Present" : exp.endDate].filter(Boolean).join(" – ");
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.role || ""}${exp.company ? `, ${exp.company}` : ""}`, bold: true, size: 22, font: "Calibri" }),
            new TextRun({ text: exp.location ? `  ·  ${exp.location}` : "", size: 20, font: "Calibri", color: "555555" }),
          ],
          spacing: { before: 120, after: 40 },
        })
      );
      if (dateStr) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: dateStr, size: 18, font: "Calibri", color: "777777", italics: true })],
            spacing: { after: 60 },
          })
        );
      }
      htmlToPlainLines(exp.description).forEach((line) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 20, font: "Calibri" })],
            spacing: { after: 40 },
            indent: { left: 360 },
          })
        );
      });
    });
  }

  // ── Skills ───────────────────────────────────────────────────────────
  if (sectionVisibility.skills && skills.length > 0) {
    children.push(sectionHeading("Skills"));
    const byLevel = LEVEL_ORDER.reduce<Record<string, typeof skills>>((acc, level) => {
      const g = skills.filter((s) => s.expertiseLevel === level);
      if (g.length > 0) acc[level] = g;
      return acc;
    }, {});
    Object.entries(byLevel).forEach(([level, group]) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${level}: `, bold: true, size: 20, font: "Calibri" }),
            new TextRun({ text: group.map((s) => s.skill).join(", "), size: 20, font: "Calibri" }),
          ],
          spacing: { after: 80 },
        })
      );
    });
    // Skills without a level
    const unlevel = skills.filter((s) => !s.expertiseLevel);
    if (unlevel.length > 0) {
      children.push(bodyText(unlevel.map((s) => s.skill).join(", ")));
    }
  }

  // ── Education ────────────────────────────────────────────────────────
  if (sectionVisibility.education && education.length > 0) {
    children.push(sectionHeading("Education"));
    education.forEach((edu) => {
      const dateStr = [edu.startYear, edu.endYear].filter(Boolean).join(" – ");
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree || "", bold: true, size: 22, font: "Calibri" }),
            new TextRun({ text: edu.institution ? `, ${edu.institution}` : "", size: 20, font: "Calibri", color: "555555" }),
          ],
          spacing: { before: 120, after: 40 },
        })
      );
      if (dateStr || edu.location) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: [dateStr, edu.location].filter(Boolean).join("  ·  "), size: 18, font: "Calibri", color: "777777", italics: true })],
            spacing: { after: 60 },
          })
        );
      }
      if (edu.gpa) children.push(bodyText(`GPA: ${edu.gpa}`));
      htmlToPlainLines(edu.description).forEach((line) =>
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 20, font: "Calibri" })], spacing: { after: 40 }, indent: { left: 360 } }))
      );
    });
  }

  // ── Projects ─────────────────────────────────────────────────────────
  if (sectionVisibility.projects && projects.length > 0) {
    children.push(sectionHeading("Projects"));
    projects.forEach((proj) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const titleRuns: any[] = [
        new TextRun({ text: proj.title || "Project", bold: true, size: 22, font: "Calibri" }),
      ];
      if (proj.link) {
        titleRuns.push(new TextRun({ text: "  " }));
        titleRuns.push(
          new ExternalHyperlink({ link: proj.link, children: [new TextRun({ text: "↗ Link", style: "Hyperlink", size: 18, font: "Calibri" })] })
        );
      }
      children.push(new Paragraph({ children: titleRuns, spacing: { before: 120, after: 40 } }));
      if (proj.technologies) children.push(bodyText(proj.technologies, { italic: true }));
      htmlToPlainLines(proj.description).forEach((line) =>
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 20, font: "Calibri" })], spacing: { after: 40 }, indent: { left: 360 } }))
      );
    });
  }

  // ── Certifications ───────────────────────────────────────────────────
  if (sectionVisibility.certifications && certifications.length > 0) {
    children.push(sectionHeading("Certifications"));
    certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20, font: "Calibri" }),
            new TextRun({ text: cert.issuer ? `  ·  ${cert.issuer}` : "", size: 20, font: "Calibri", color: "555555" }),
            new TextRun({ text: cert.date ? `  ·  ${cert.date}` : "", size: 18, font: "Calibri", color: "777777" }),
          ],
          spacing: { after: 80 },
        })
      );
    });
  }

  // ── Hobbies ──────────────────────────────────────────────────────────
  if (sectionVisibility.hobbies && hobbies.length > 0) {
    const hobbyList = hobbies.map((h) => h.description).filter(Boolean).join(" · ");
    if (hobbyList) {
      children.push(sectionHeading("Interests"));
      children.push(bodyText(hobbyList));
    }
  }

  // ── Build Doc ────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20 } },
      },
      paragraphStyles: [
        {
          id: "Hyperlink",
          name: "Hyperlink",
          basedOn: "Normal",
          run: { color: "2563EB", underline: {} },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, `${personalInfo.name || "resume"}.docx`);
}
