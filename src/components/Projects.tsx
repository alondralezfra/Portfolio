/**
 * Interface for project
 */
interface Project {
  title: string;
  description: string;
  duration: string;
  tech: string[];
  website?: string;
  code?: string;
}

/**
 * Props interface to pass in projects as a single object destructured.
 */
interface Props {
  projects: Project[];
}

/**
 * React component for projects.
 * @param param0 
 * @returns 
 */
export function Projects({ projects }: Props) {
  return (
    <section className="projects-panel">
        <h2 className="section-title">Projects</h2>
        <ul className="projects-grid">
            {projects.map((p) => (
            <li key={p.title} className="project-card">
                <h3>{p.title}</h3>
                <em>{p.duration}</em>
                <p>{p.description}</p>
                <ul className="tech-list">
                    {p.tech.map(t => (
                        <li key={t}>{t}</li>
                    ))}
                </ul>
                <div className="project-actions">
                    {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer" className="btn">
                        Visit website
                        </a>
                    )}
                    {p.code && (
                        <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn secondary">
                        View code
                        </a>
                    )}
                </div>
            </li>
            ))}
        </ul>
    </section>
  );
}
