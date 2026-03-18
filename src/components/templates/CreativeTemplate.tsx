import { ResumeData } from '@/types/resume';

interface Props {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: Props) {
  const { personalInfo, education, experience, skills, projects, certifications, hobbies, sectionVisibility } = data;

  return (
    <div className="font-sans text-[#111827] bg-white w-full min-h-full text-sm leading-relaxed">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899]" />

      <div className="p-8">
        {/* Name + contact row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[#111827]">{personalInfo.name || 'Your Name'}</h1>
          </div>
          <div className="text-right text-xs text-[#6B7280] space-y-0.5">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>

        {/* Summary */}
        {sectionVisibility.summary && personalInfo.summary && (
          <div className="mb-5 p-4 bg-[#EFF6FF] rounded-md border-l-4 border-[#2563EB]">
            <p className="text-[#374151]">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5">
          {/* Experience */}
          {sectionVisibility.experience && experience.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-[#2563EB] mb-3">
                <span className="inline-block w-6 h-0.5 bg-[#2563EB]" />
                Experience
              </h2>
              <div className="space-y-4 ml-2">
                {experience.map(exp => (
                  <div key={exp.id} className="pl-3 border-l-2 border-[#BFDBFE]">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#111827]">{exp.role || 'Job Title'}</p>
                        <p className="text-[#2563EB] text-xs font-semibold">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full shrink-0 ml-3">
                        {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && <p className="mt-1.5 text-[#4B5563] whitespace-pre-line text-xs">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {sectionVisibility.skills && skills.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-[#7C3AED] mb-3">
                <span className="inline-block w-6 h-0.5 bg-[#7C3AED]" />
                Skills
              </h2>
              <div className="ml-2 flex flex-wrap gap-2">
                {skills.map(skillCat => (
                  <div key={skillCat.id}>
                    {skillCat.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#2563EB] mr-1.5 mb-1.5">{s}</span>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {sectionVisibility.education && education.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-[#EC4899] mb-3">
                <span className="inline-block w-6 h-0.5 bg-[#EC4899]" />
                Education
              </h2>
              <div className="space-y-3 ml-2">
                {education.map(edu => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <p className="font-bold text-[#111827]">{edu.degree}</p>
                      <p className="text-[#6B7280] text-xs">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                      {edu.gpa && <p className="text-[#6B7280] text-xs">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-[#9CA3AF] text-xs shrink-0 ml-4">{edu.startYear}{edu.startYear && edu.endYear ? ' – ' : ''}{edu.endYear}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {sectionVisibility.projects && projects.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-[#2563EB] mb-3">
                <span className="inline-block w-6 h-0.5 bg-[#2563EB]" />
                Projects
              </h2>
              <div className="grid grid-cols-1 gap-2 ml-2">
                {projects.map(proj => (
                  <div key={proj.id} className="p-3 bg-[#F9FAFB] rounded-md border border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#111827]">{proj.title || 'Project'}</p>
                      {proj.link && <a href={proj.link} className="text-[#2563EB] text-[10px]" target="_blank" rel="noreferrer">↗</a>}
                    </div>
                    {proj.technologies && (
                      <p className="text-[#7C3AED] text-[10px] font-semibold">{proj.technologies}</p>
                    )}
                    {proj.description && <p className="mt-1 text-[#4B5563] text-xs">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {sectionVisibility.certifications && certifications.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-[#6B7280] mb-3">
                <span className="inline-block w-6 h-0.5 bg-[#6B7280]" />
                Certifications
              </h2>
              <div className="space-y-1 ml-2">
                {certifications.map(cert => (
                  <div key={cert.id} className="flex justify-between">
                    <span className="font-medium">{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</span>
                    <span className="text-[#9CA3AF] text-xs">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {sectionVisibility.hobbies && hobbies.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-widest text-[#6B7280] mb-2">
                <span className="inline-block w-6 h-0.5 bg-[#6B7280]" />
                Interests
              </h2>
              <p className="text-[#4B5563] ml-2">{hobbies.map(h => h.description).filter(Boolean).join(' · ')}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
