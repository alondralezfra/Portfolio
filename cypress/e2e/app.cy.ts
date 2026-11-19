import "cypress-axe";

const tab = (name: string) => cy.contains('[role="tab"]', name);

describe("Portfolio cafe", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows the title and starts on the bread tray", () => {
    cy.get('[data-testid="title"]').should("contain.text", "Alondra");
    tab("Bread Tray").should("have.attr", "aria-selected", "true");
    cy.get("#panel-bread-tray").should("be.visible");
    cy.get("#panel-drinks").should("not.be.visible");
  });

  it("switches sections with the tabs and updates the URL hash", () => {
    tab("Drinks").click();
    cy.get("#panel-drinks").should("be.visible");
    cy.get("#panel-bread-tray").should("not.be.visible");
    cy.location("hash").should("eq", "#drinks");

    tab("Our Story").click();
    cy.get("#panel-our-story").should("be.visible");
    cy.get(".controls").should("not.exist");
  });

  it("opens the section named in the URL hash", () => {
    cy.visit("/#our-story");
    tab("Our Story").should("have.attr", "aria-selected", "true");
  });

  it("moves between tabs with the arrow keys", () => {
    tab("Bread Tray").focus().type("{rightarrow}");
    tab("Drinks").should("have.attr", "aria-selected", "true").and("have.focus");
    tab("Drinks").type("{leftarrow}");
    tab("Bread Tray").should("have.attr", "aria-selected", "true");
  });

  it("filters dishes with Brew your stack and announces the result", () => {
    cy.get("#panel-bread-tray .menu-item").its("length").then((all) => {
      cy.contains("button.chip", /^Go$/).click();
      cy.get("#panel-bread-tray .menu-item").should("have.length.lessThan", all);
      cy.get('[data-testid="match-status"]').should("contain.text", "all of: Go");

      cy.contains("button", "Clear ingredients").click();
      cy.get("#panel-bread-tray .menu-item").should("have.length", all);
    });
  });

  it("shows a message when no dish uses every selected ingredient", () => {
    cy.contains("button.chip", /^Go$/).click();
    cy.contains("button.chip", "Spring Boot").click();
    cy.get("#panel-bread-tray .empty").should("be.visible");
  });

  it("changes the level of detail with the sweetness picker", () => {
    cy.get("#panel-bread-tray .menu-item").first().invoke("text").then((medium) => {
      cy.contains("label", "Deep").click();
      cy.get("#panel-bread-tray .menu-item").first().invoke("text").should("not.eq", medium);
      cy.contains("label", "Light").click();
      cy.get("#panel-bread-tray .menu-item").first().invoke("text").should("not.eq", medium);
    });
  });

  it("links to code and websites safely", () => {
    cy.contains("#panel-bread-tray a", "View code")
      .should("have.attr", "href")
      .and("match", /^https:\/\/github\.com\//);
    cy.contains("#panel-bread-tray a", "View code").should("have.attr", "rel", "noopener noreferrer");
  });

  it("has no console errors on load", () => {
    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });
    cy.get("@consoleError").should("not.have.been.called");
  });

  describe("accessibility (axe)", () => {
    for (const name of ["Bread Tray", "Drinks", "Our Story"]) {
      it(`has no detectable violations on ${name}`, () => {
        tab(name).click();
        cy.injectAxe();
        cy.checkA11y();
      });
    }
  });
});
