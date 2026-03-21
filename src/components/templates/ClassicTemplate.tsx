import { ResumeData } from '@/types/resume';

interface Props {
  data: ResumeData;
}

// Helper to strip HTML tags for plain text rendering in templates
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Helper to render rich HTML content safely inside templates
function RichContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  // If it starts with '<', it's HTML from the rich text editor
  if (html.trim().startsWith('<')) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <p className={className}>{html}</p>;
}

export default function ClassicTemplate({ data }: Props) {
  const { personalInfo, education, experience, skills, projects, certifications, hobbies, sectionVisibility } = data;

  const contactParts = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
  ].filter(Boolean);

  const linkParts = [
    personalInfo.linkedin && { label: 'LinkedIn', href: personalInfo.linkedin },
    personalInfo.website && { label: 'Portfolio', href: personalInfo.website },
  ].filter(Boolean) as { label: string; href: string }[];

  // Split skills into two columns
  const leftSkills = skills.filter((_, i) => i % 2 === 0);
  const rightSkills = skills.filter((_, i) => i % 2 === 1);

  return (
    <div className="font-serif text-[#1a1a1a] bg-white w-full min-h-full p-10 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

      {/* Header — centered */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide uppercase" style={{ letterSpacing: '0.05em' }}>
          {personalInfo.name || 'Your Name'}
          {personalInfo.name && experience.length > 0 && experience[0].role ? `, ${experience[0].role}` : ''}
        </h1>
        {contactParts.length > 0 && (
          <p className="text-sm text-[#444] mt-1">{contactParts.join(', ')}</p>
        )}
      </div>

      <div className="border-t border-[#222] mb-0" />

      {/* Links */}
      {linkParts.length > 0 && (
        <>
          <div className="flex gap-0">
            {/* Label col */}
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Links</span>
            </div>
            {/* Content col */}
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6">
              <p className="text-sm">
                {linkParts.map((l, i) => (
                  <span key={l.label}>
                    <a href={l.href} className="underline text-[#1a1a1a]" target="_blank" rel="noreferrer">{l.label}</a>
                    {i < linkParts.length - 1 && <span className="mx-1">,</span>}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}

      {/* Summary / Profile */}
      {sectionVisibility.summary && personalInfo.summary && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Profile</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6">
              <RichContent html={personalInfo.summary} className="text-sm text-[#222] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5" />
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Experience</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6 space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <p className="text-[11px] text-[#555]">
                      {exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? ' — ' : ''}
                      {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="font-bold text-sm uppercase tracking-wide">{exp.role || 'Job Title'}, {exp.company}</p>
                    {exp.location && <p className="text-[11px] text-[#555] shrink-0 ml-4">{exp.location}</p>}
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

      {/* Skills — two column grid */}
      {sectionVisibility.skills && skills.length > 0 && (
        <>
          <div className="flex gap-0">
            <div className="w-[160px] shrink-0 pt-3 pb-3 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Skills</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6">
              <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                {/* Left column */}
                <div className="space-y-1">
                  {leftSkills.map(s => (
                    <div key={s.id} className="flex items-baseline justify-between">
                      <span className="text-sm text-[#1a1a1a]">{s.skill}</span>
                      <span className="text-sm text-[#555] ml-4">{s.expertiseLevel}</span>
                    </div>
                  ))}
                </div>
                {/* Right column */}
                <div className="space-y-1">
                  {rightSkills.map(s => (
                    <div key={s.id} className="flex items-baseline justify-between">
                      <span className="text-sm text-[#1a1a1a]">{s.skill}</span>
                      <span className="text-sm text-[#555] ml-4">{s.expertiseLevel}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Education</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6 space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="text-[11px] text-[#555] mb-1">
                    {edu.startYear}{edu.startYear && edu.endYear ? ' — ' : ''}{edu.endYear}
                  </p>
                  <p className="font-bold text-sm uppercase tracking-wide">
                    {edu.degree}{edu.institution ? `, ${edu.institution}` : ''}
                    {edu.location ? ` - ${edu.location}` : ''}
                  </p>
                  {edu.gpa && <p className="text-sm text-[#555]">GPA: {edu.gpa}</p>}
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Projects</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6 space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <p className="font-semibold text-sm">{proj.title || 'Project'}</p>
                  {proj.description && (
                    <RichContent
                      html={proj.description}
                      className="mt-0.5 text-sm text-[#333] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5"
                    />
                  )}
                  {proj.link && (
                    <a href={proj.link} className="text-sm underline text-[#1a1a1a] block mt-0.5" target="_blank" rel="noreferrer">Link</a>
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Certifications</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6 space-y-2">
              {certifications.map(cert => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-sm">{cert.name}</span>
                    {cert.issuer && <span className="text-sm text-[#555]"> · {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-xs text-[#777]">{cert.date}</span>}
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Interests</span>
            </div>
            <div className="flex-1 pt-3 pb-3 border-l border-[#ccc] pl-6">
              <p className="text-sm text-[#333]">{hobbies.map(h => stripHtml(h.description)).filter(Boolean).join(' · ')}</p>
            </div>
          </div>
          <div className="border-t border-[#ccc]" />
        </>
      )}
    </div>
  );
}
