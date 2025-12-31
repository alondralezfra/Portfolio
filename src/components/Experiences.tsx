/**
 * Interface for experience
 */
interface Experience {
  title: string;
  company: string;
  description: string;
  duration: string;
  tech: string[];
}

/**
 * Props interface to pass in experiences as a single object destructured.
 */
interface Props {
  experiences: Experience[];
}

/**
 * React component for experiences.
 * @param param0 
 * @returns 
 */
export function Experiences({ experiences }: Props) {
  return (
    <section className="experiences-panel">
      <h2 className="section-title">Experience</h2>
      <ul className="experiences">
        {experiences.map((exp) => (
          <li key={exp.title} className="experience-item">
                <p className="experience-content">
                    <h3>{exp.title}</h3>
                    <strong>{exp.company}</strong>
                    <p>{exp.description}</p>
                    <em className="experience-duration">{exp.duration}</em>
                    <ul className="tech-list">
                        {exp.tech.map(t => (
                            <li key={t}>{t}</li>
                        ))}
                    </ul>
                </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
