import { useEffect, useMemo, useState } from "react";
import { Model } from "./model";
import { collectTech, describeMatches, filterByStack, type Level } from "./menu";
import { Tabs, type TabDef } from "./components/Tabs";
import { BrewFilter } from "./components/BrewFilter";
import { SweetnessPicker } from "./components/SweetnessPicker";
import { MenuList } from "./components/MenuList";
import { OurStory } from "./components/OurStory";
import { BusinessCard } from "./components/BusinessCard";

const model = new Model();

const TABS: readonly TabDef[] = [
  { id: "bread-tray", label: "Bread Tray", hint: "Projects" },
  { id: "drinks", label: "Drinks", hint: "Job Experience" },
  { id: "our-story", label: "Our Story", hint: "About me" },
];

function tabFromHash(): string {
  const id = window.location.hash.replace("#", "");
  return TABS.some((tab) => tab.id === id) ? id : "bread-tray";
}

/** Renders the application view. */
export default function AppView() {
  const state = useMemo(() => model.getState(), []);
  const [activeId, setActiveId] = useState(tabFromHash);
  const [level, setLevel] = useState<Level>("medium");
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    const onHashChange = () => setActiveId(tabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function selectTab(id: string) {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  function toggleTech(tech: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(tech)) next.delete(tech);
      else next.add(tech);
      return next;
    });
  }

  const options = useMemo(() => collectTech([...state.projects, ...state.experiences]), [state]);
  const projects = filterByStack(state.projects, selected);
  const experiences = filterByStack(state.experiences, selected);
  const showControls = activeId !== "our-story";
  const activeCount = activeId === "drinks" ? experiences.length : projects.length;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header">
        <h1 data-testid="title">{state.title}</h1>
        <p data-testid="tagline">{state.tagline}</p>
        <BusinessCard contact={state.contact} />
      </header>
      <nav aria-label="Cafe sections">
        <Tabs tabs={TABS} activeId={activeId} onSelect={selectTab} />
      </nav>
      <main id="main">
        {showControls && (
          <div className="controls">
            <BrewFilter
              options={options}
              selected={selected}
              onToggle={toggleTech}
              onClear={() => setSelected(new Set())}
            />
            <SweetnessPicker value={level} onChange={setLevel} />
            <p className="visually-hidden" role="status" aria-live="polite" data-testid="match-status">
              {describeMatches(activeCount, selected)}
            </p>
          </div>
        )}

        <section role="tabpanel" id="panel-bread-tray" aria-labelledby="tab-bread-tray" hidden={activeId !== "bread-tray"}>
          <h2>Bread Tray <span className="subtitle">Projects</span></h2>
          <MenuList
            items={projects}
            level={level}
            emptyMessage="No projects use all of the selected ingredients."
            actions={(p) =>
              (p.website || p.code) && (
                <p className="project-actions">
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="btn">
                      Visit website<span className="visually-hidden"> for {p.title} (opens in a new tab)</span>
                    </a>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn secondary">
                      View code<span className="visually-hidden"> for {p.title} (opens in a new tab)</span>
                    </a>
                  )}
                </p>
              )
            }
          />
        </section>

        <section role="tabpanel" id="panel-drinks" aria-labelledby="tab-drinks" hidden={activeId !== "drinks"}>
          <h2>Drinks <span className="subtitle">Job Experience</span></h2>
          <MenuList
            items={experiences}
            level={level}
            eyebrow={(e) => e.company}
            emptyMessage="No roles use all of the selected ingredients."
          />
        </section>

        <section role="tabpanel" id="panel-our-story" aria-labelledby="tab-our-story" hidden={activeId !== "our-story"}>
          <OurStory story={state.story} />
        </section>
      </main>
    </>
  );
}
