import { Model } from "./model";
import { View } from "./view";
import { logger } from "./logging/logger"

export class Controller {
  private readonly model: Model;
  private readonly view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  init(): void {
    logger.debug("Controller initialized");
    const state = this.model.getState();
    this.view.render(state);
  }
}
