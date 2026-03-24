import { ResumeData } from "@/types/resume";

function RichContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  if (html.trim().startsWith("<")) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <p className={className}>{html}</p>;
}

interface Props { data: ResumeData; }

export default function MinimalTemplate({ data }: Props) {
  const { personalInfo, education, experience, skills, projects, certifications, hobbies, links, sectionVisibility } = data;

  return (
    <div className="font-sans text-[#111827] bg-white w-full min-h-full p-10 text-sm leading-relaxed">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#E5E7EB] resume-entry">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">{personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[#6B7280] text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {sectionVisibility.links && links && links.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {links.filter((l) => l.name || l.link).map((l) => (
              <a key={l.id} href={l.link} target="_blank" rel="noreferrer" className="text-[#2563EB] text-xs underline">
                {l.name || l.link}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {sectionVisibility.summary && data.summary && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">Profile</h2>
          <RichContent html={data.summary} className="text-[#4B5563] text-xs [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_a]:text-[#2563EB] [&_a]:underline" />
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="resume-entry">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#111827]">{exp.role || "Job Title"}</p>
                    <p className="text-[#374151]">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-[#9CA3AF] text-xs shrink-0 ml-4">
                    {exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                {exp.description && (
                  <RichContent html={exp.description} className="mt-1 text-[#4B5563] text-xs [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_a]:text-[#2563EB] [&_a]:underline" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && skills.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">Skills</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-baseline resume-entry">
                <span className="text-[#374151]">{skill.skill}</span>
                {skill.expertiseLevel && <span className="text-[#6B7280] text-xs">{skill.expertiseLevel}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="resume-entry">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#111827]">{edu.degree || "Degree"}</p>
                    <p className="text-[#374151]">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                    {edu.gpa && <p className="text-[#6B7280] text-xs">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-[#9CA3AF] text-xs shrink-0 ml-4">
                    {edu.startYear}{edu.startYear ? " – " : ""}{edu.endYear}
                  </p>
                </div>
                {edu.description && (
                  <RichContent html={edu.description} className="mt-1 text-[#4B5563] text-xs [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_a]:text-[#2563EB] [&_a]:underline" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-3">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="resume-entry">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#111827]">{proj.title || "Project Title"}</p>
                  {proj.link && (
                    <a href={proj.link} className="text-[#2563EB] text-xs underline" target="_blank" rel="noreferrer">Link</a>
                  )}
                </div>
                {proj.technologies && <p className="text-[#6B7280] text-xs">{proj.technologies}</p>}
                {proj.description && (
                  <RichContent html={proj.description} className="mt-1 text-[#4B5563] text-xs [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_a]:text-[#2563EB] [&_a]:underline" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {sectionVisibility.certifications && certifications.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">Certifications</h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between resume-entry">
                <div>
                  <span className="font-medium text-[#111827]">{cert.name}</span>
                  {cert.issuer && <span className="text-[#6B7280]"> · {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-[#9CA3AF] text-xs">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hobbies */}
      {sectionVisibility.hobbies && hobbies.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-2">Interests</h2>
          <p className="text-[#4B5563]">{hobbies.map((h) => h.description).filter(Boolean).join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
