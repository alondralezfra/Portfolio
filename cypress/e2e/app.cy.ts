import "cypress-axe";
import type { Result } from "axe-core";

/** Prints each axe violation (rule, impact and elements) so a CI failure is diagnosable from the log. */
function logViolations(violations: Result[]) {
  for (const v of violations) {
    const nodes = v.nodes.map((n) => n.target.join(" ")).join("\n    ");
    cy.task("log", `AXE ${v.impact}: ${v.id} - ${v.help}\n    ${nodes}`);
  }
}

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

  it("links Formism to its live site", () => {
    cy.contains("#panel-bread-tray li", "Formism")
      .contains("a", "Visit website")
      .should("have.attr", "href", "https://formism.app/");
  });

  it("shows the Our Story photos with alt text", () => {
    cy.visit("/#our-story");
    cy.get("#panel-our-story img.photo").should("have.length.at.least", 7);
    // Photos are lazy-loaded, so scroll each into view and wait until it has really loaded.
    cy.get("#panel-our-story img.photo").each(($img) => {
      expect($img.attr("alt")).to.not.be.empty;
      cy.wrap($img)
        .scrollIntoView()
        .should(($el) => {
          expect(($el[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        });
    });
  });

  it("has no console errors on load", () => {
    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });
    cy.get("@consoleError").should("not.have.been.called");
  });

  describe("business card", () => {
    const openCard = () => cy.contains("button", "Get my card").click();

    it("opens a dialog with the front of the card and closes it with the button, returning focus", () => {
      openCard();
      cy.get("dialog[open]").should("be.visible").and("contain.text", "Alondra Franco");
      cy.contains("dialog button", "Close").click();
      cy.get("dialog[open]").should("not.exist");
      cy.contains("button", "Get my card").should("have.focus");
    });

    it("closes with Escape", () => {
      openCard();
      // A dialog is not typeable itself; the key press goes to a focused control and bubbles up to it.
      cy.contains("dialog button", "Flip card").focus().type("{esc}");
      cy.get("dialog[open]").should("not.exist");
    });

    it("flips to the contact links", () => {
      openCard();
      cy.contains("dialog a", "LinkedIn").should("not.be.visible");
      cy.contains("dialog button", "Flip card").click();
      cy.contains("dialog a", "LinkedIn")
        .should("be.visible")
        .and("have.attr", "href", "https://www.linkedin.com/in/alondra-franco-/");
      cy.contains("dialog a", "GitHub").should("have.attr", "href", "https://github.com/alondralezfra");
      cy.contains("dialog a", "alondralezfra@hotmail.com").should("have.attr", "href", "mailto:alondralezfra@hotmail.com");
    });

    it("copies the email and announces it", () => {
      cy.window().then((win) => {
        cy.stub(win.navigator.clipboard, "writeText").as("writeText").resolves();
      });
      openCard();
      cy.contains("dialog button", "Flip card").click();
      cy.contains("dialog button", "Copy email").click();
      cy.get("@writeText").should("have.been.calledWith", "alondralezfra@hotmail.com");
      cy.get("dialog [role=status]").should("contain.text", "copied");
    });

    it("has no detectable accessibility violations while open", () => {
      openCard();
      cy.contains("dialog button", "Flip card").click();
      cy.injectAxe();
      cy.checkA11y(undefined, undefined, logViolations);
    });
  });

  describe("accessibility (axe)", () => {
    for (const name of ["Bread Tray", "Drinks", "Our Story"]) {
      it(`has no detectable violations on ${name}`, () => {
        tab(name).click();
        cy.injectAxe();
        cy.checkA11y(undefined, undefined, logViolations);
      });
    }
  });
});
