import experiences from "./data/experiences.json";
import projects from "./data/projects.json";

/**
 * Interface for experience
 */
export interface Experience {
  title: string;
  company: string;
  description: string;
  duration: string;
  tech: string[];
}

/**
 * Interface for project
 */
export interface Project {
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
    bio: "Houston-based software engineer. Most recently a cloud operations intern at Somos Inc.",
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
