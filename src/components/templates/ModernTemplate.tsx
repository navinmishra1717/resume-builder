import { ResumeData } from '@/types/resume';

interface Props {
  data: ResumeData;
}

export default function ModernTemplate({ data }: Props) {
  const { personalInfo, education, experience, skills, projects, certifications, hobbies, sectionVisibility } = data;

  return (
    <div className="font-sans text-[#111827] bg-white w-full min-h-full flex text-sm leading-relaxed">
      {/* Left sidebar */}
      <div className="w-[38%] bg-[#1E3A5F] text-white p-7 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold leading-tight">{personalInfo.name || 'Your Name'}</h1>
          <div className="mt-3 space-y-1 text-[#93C5FD] text-xs">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>

        {sectionVisibility.skills && skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#93C5FD] mb-2 pb-1 border-b border-[#2563EB]/40">Skills</h2>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id}>
                  {skill.category && <p className="text-[#BFDBFE] text-[10px] font-semibold uppercase">{skill.category}</p>}
                  <p className="text-white text-xs">{skill.skills}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionVisibility.education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#93C5FD] mb-2 pb-1 border-b border-[#2563EB]/40">Education</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-semibold text-white text-xs">{edu.degree}</p>
                  <p className="text-[#93C5FD] text-xs">{edu.institution}</p>
                  {edu.location && <p className="text-[#60A5FA] text-[10px]">{edu.location}</p>}
                  <p className="text-[#BFDBFE] text-[10px]">
                    {edu.startYear}{edu.startYear && edu.endYear ? ' – ' : ''}{edu.endYear}
                    {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionVisibility.certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#93C5FD] mb-2 pb-1 border-b border-[#2563EB]/40">Certifications</h2>
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <p className="font-medium text-white text-xs">{cert.name}</p>
                  <p className="text-[#93C5FD] text-[10px]">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionVisibility.hobbies && hobbies.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#93C5FD] mb-2 pb-1 border-b border-[#2563EB]/40">Interests</h2>
            <p className="text-white text-xs">{hobbies.map(h => h.description).filter(Boolean).join(', ')}</p>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-7 flex flex-col gap-5">
        {sectionVisibility.summary && personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2 pb-1 border-b-2 border-[#2563EB]">Profile</h2>
            <p className="text-[#374151]">{personalInfo.summary}</p>
          </section>
        )}

        {sectionVisibility.experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-3 pb-1 border-b-2 border-[#2563EB]">Experience</h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#111827]">{exp.role || 'Job Title'}</p>
                      <p className="text-[#2563EB] font-medium text-xs">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-[#9CA3AF] text-xs shrink-0 ml-4">
                      {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className="mt-1 text-[#4B5563] whitespace-pre-line text-xs">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-3 pb-1 border-b-2 border-[#2563EB]">Projects</h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#111827]">{proj.title || 'Project'}</p>
                    {proj.link && <a href={proj.link} className="text-[#2563EB] text-[10px] underline" target="_blank" rel="noreferrer">↗ Link</a>}
                  </div>
                  {proj.technologies && <p className="text-[#6B7280] text-[10px] font-medium">{proj.technologies}</p>}
                  {proj.description && <p className="mt-0.5 text-[#4B5563] text-xs">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
