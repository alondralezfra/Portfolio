// Import experiences and projects data
import experiences from "./data/experiences.json";
import projects from "./data/projects.json";

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
 * Interface for app state.
 */
export interface AppState {
  title: string;
  bio: string,
  experiences: Experience[];
  projects: Project[];
}

/**
 * Model class to store and handle app state.
 */
export class Model {
  private state: AppState = {
    title: "Alondra Franco",
    bio: "I’m a senior at Rice University studying computer science, with a strong interest in backend systems and software architecture. I communicate clearly, motivate teams with energy and optimism, and naturally take initiative in group projects—either as a leader or as a facilitator who keeps collaboration flowing smoothly. What drives me most is the opportunity to help others and to keep learning every day. I value openness, mentorship, diversity, and impact, and I believe great work happens when people feel happy and supported throughout the process.",
    experiences,
    projects,
  };

  /**
   * Clones the current state to return.
   * @returns current state
   */
  getState(): AppState {
    return structuredClone(this.state);
  }
}
