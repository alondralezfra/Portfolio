import experiences from "./data/experiences.json";
import projects from "./data/projects.json";
import story from "./data/story.json";
import type { MenuItem } from "./menu";

/** A project (a bread on the tray). */
export interface Project extends MenuItem {
  website?: string;
  code?: string;
}

/** A job (a drink on the menu). */
export interface Experience extends MenuItem {
  company: string;
}

export interface Hobby {
  id: string;
  title: string;
  description: string;
  photo: string | null;
  photoAlt: string;
}

export interface Story {
  owner: { heading: string; paragraphs: string[]; photo: string | null; photoAlt: string };
  origin: { heading: string; text: string };
  hobbies: Hobby[];
  culture: { heading: string; paragraphs: string[] };
  photos: { id: string; src: string | null; alt: string; caption: string }[];
}

export interface AppState {
  title: string;
  tagline: string;
  experiences: Experience[];
  projects: Project[];
  story: Story;
}

/** Holds the site's content. Components get a copy and never edit it. */
export class Model {
  private state: AppState = {
    title: "Alondra Franco",
    tagline: "Software engineer, dancer and musician. Pull up a chair and order a project.",
    experiences: experiences as Experience[],
    projects: projects as Project[],
    story: story as Story,
  };

  getState(): AppState {
    return structuredClone(this.state);
  }
}
