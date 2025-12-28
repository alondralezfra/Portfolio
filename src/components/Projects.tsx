import type { Project } from "../model";

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
    <section className="panel-section projects-panel">
        <h2 className="section-title">Projects</h2>
        <ul className="projects-grid">
            {projects.map((p) => (
            <li key={p.title} className="project-card">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <em>{p.duration}</em>
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
