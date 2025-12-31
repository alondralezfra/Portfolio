import React from "react";
import { Model } from "./model";
import { Bio } from "./components/Bio";
import { Experiences } from "./components/Experiences";
import { Projects } from "./components/Projects";
import { FluidBackground } from "./components/FluidBackground";

// Initialize model
const model = new Model();

/**
 * Renders the application view.
 * @returns 
 */
export default function AppView() {
  const state = model.getState();

  return (
    <>
    <FluidBackground />
    <main>
      <Bio title={state.title} bio={state.bio} />
      <section className='panel-section'>
        <Experiences experiences={state.experiences} />
        <Projects projects={state.projects} />
      </section>
    </main>
    </>
  );
}
