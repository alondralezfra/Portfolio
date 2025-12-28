import React from "react";
import { Model } from "./model";
import { Bio } from "./components/Bio";
import { Experiences } from "./components/Experiences";
import { Projects } from "./components/Projects";

// Initialize model
const model = new Model();

/**
 * Renders the application view.
 * @returns 
 */
export default function AppView() {
  const state = model.getState();

  return (
    <main>
      <Bio title={state.title} bio={state.bio} />
      <Experiences experiences={state.experiences} />
      <Projects projects={state.projects} />
    </main>
  );
}
