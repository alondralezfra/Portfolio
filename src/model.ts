export interface AppState {
  title: string;
}

export class Model {
  private state: AppState;

  constructor() {
    this.state = { title: "Hello, I'm Alondra 👋" };
  }

  getState(): AppState {
    return { ...this.state };
  }
}
