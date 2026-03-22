import { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
}

// Helper to strip HTML tags for plain text rendering in templates
function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper to render rich HTML content safely inside templates
function RichContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  if (!html) return null;
  // If it starts with '<', it's HTML from the rich text editor
  if (html.trim().startsWith("<")) {
    return (
      <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  return <p className={className}>{html}</p>;
}

export default function ClassicTemplate({ data }: Props) {
  const {
    personalInfo,
    summary,
    education,
    experience,
    skills,
    projects,
    certifications,
    hobbies,
    links,
    sectionVisibility,
  } = data;

  const contactParts = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
  ].filter(Boolean);

  // Group skills by expertise level in display order
  const LEVEL_ORDER = ["Expert", "Experienced", "Skillful", "Beginner"];
  const skillsByLevel = LEVEL_ORDER.reduce<Record<string, typeof skills>>(
    (acc, level) => {
      const group = skills.filter((s) => s.expertiseLevel === level);
      if (group.length > 0) acc[level] = group;
      return acc;
    },
    {},
  );

  return (
    <div
      className="font-serif text-[#1a1a1a] bg-white w-full min-h-full p-10 text-sm leading-relaxed"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Header — centered */}
      <div className="text-center mb-6">
        <h1
          className="text-4xl font-bold tracking-wide uppercase"
          style={{ letterSpacing: "0.05em" }}
        >
          {personalInfo.name || "Your Name"}
        </h1>
        <h1 className="text-2xl" style={{ letterSpacing: "0.05em" }}>
          {personalInfo.name && experience.length > 0 && experience[0].role
            ? ` ${experience[0].role}`
            : ""}
        </h1>
        {contactParts.length > 0 && (
          <p className="text-sm text-[#444] mt-1">
            {contactParts.join("  ·  ")}
          </p>
        )}
        {sectionVisibility.links && links && links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
            {links
              .filter((l) => l.name || l.link)
              .map((l) => (
                <a
                  key={l.id}
                  href={l.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#1a1a1a] underline"
                >
                  {l.name || l.link}
                </a>
              ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#ccc] mb-0" />

      {/* Professional Summary */}
      {sectionVisibility.summary && summary && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Profile
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6">
              <RichContent html={summary} />
            </div>
          </div>

          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Experience
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6 space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <p className="text-[11px] text-[#555]">
                      {exp.startDate}
                      {exp.startDate && (exp.current || exp.endDate)
                        ? " — "
                        : ""}
                      {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="font-bold text-sm uppercase tracking-wide">
                      {exp.role || "Job Title"},{" "}
                      {<span className="text-[#555]"> {exp.company} </span>}
                    </p>
                    {exp.location && (
                      <p className="text-[11px] text-[#555] shrink-0 ml-4">
                        {exp.location}
                      </p>
                    )}
                  </div>
                  {exp.description && (
                    <RichContent
                      html={exp.description}
                      className="mt-1 text-sm text-[#333] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Skills — grouped by expertise level */}
      {sectionVisibility.skills && skills.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Skills
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6 space-y-3">
              {Object.entries(skillsByLevel).map(([level, group]) => (
                <div key={level}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#777] mb-1">
                    {level}
                  </p>
                  <p className="text-sm text-[#1a1a1a]">
                    {group.map((s) => s.skill).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Education
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6 space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-[11px] text-[#555] mb-1">
                    {edu.startYear}
                    {edu.startYear && edu.endYear ? " — " : ""}
                    {edu.endYear}
                  </p>
                  <p className="font-bold text-sm uppercase tracking-wide">
                    {edu.degree}
                    <span className="text-[11px] text-[#555]">
                      {edu.institution ? `, ${edu.institution}` : ""}
                      {edu.location ? ` - ${edu.location}` : ""}
                    </span>
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-[#555]">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <RichContent
                      html={edu.description}
                      className="mt-1 text-sm text-[#333] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Projects
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6 space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4 last:mb-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-sm text-[#1a1a1a]">
                      {proj.title || "Project"}
                    </h3>
                  </div>

                  {/* Technologies */}
                  {proj.technologies && (
                    <p className="text-xs text-[#666] leading-tight">
                      {proj.technologies}
                    </p>
                  )}

                  {/* Description / Role */}
                  {proj.description && (
                    <div className="mt-0.5">
                      <RichContent
                        html={proj.description}
                        className="text-sm text-[#444] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                      />
                    </div>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-sm underline text-[#1a1a1a] block mt-0.5"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Certifications */}
      {sectionVisibility.certifications && certifications.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Certifications
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6 space-y-2">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-baseline"
                >
                  <div>
                    <span className="font-semibold text-sm">{cert.name}</span>
                    {cert.issuer && (
                      <span className="text-sm text-[#555]">
                        {" "}
                        · {cert.issuer}
                      </span>
                    )}
                  </div>
                  {cert.date && (
                    <span className="text-xs text-[#777]">{cert.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Hobbies */}
      {sectionVisibility.hobbies && hobbies.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Interests
              </span>
            </div>
            <div className="flex-1 pt-3 pb-3 pl-6">
              <p className="text-sm text-[#333]">
                {hobbies
                  .map((h) => stripHtml(h.description))
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}
    </div>
  );
}
