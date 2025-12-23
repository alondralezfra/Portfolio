import type { AppState } from "./model";

export class View {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  render(state: AppState): void {
    this.root.innerHTML = `
      <section>
        <h1 data-testid="title">${state.title}</h1>
      </section>
    `;
  }
}
