describe("Portfolio App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("renders the main title from the model", () => {
    cy.get('[data-testid="title"]')
      .should("exist")
      .and("contain.text", "Alondra");
  });

  it("boots without console errors", () => {
    cy.window().then((win) => {
        cy.spy(win.console, "error").as("consoleError");
    });

    cy.get("@consoleError").should("not.have.been.called");
    });
});
