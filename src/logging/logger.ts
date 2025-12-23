export type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private currentLevel: LogLevel;

  constructor(level: LogLevel = "info") {
    this.currentLevel = level;
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log("error", message, context);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (levelOrder[level] < levelOrder[this.currentLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const label = `[${level.toUpperCase()}] ${timestamp}`;

    const style =
      level === "warn"
        ? "color: orange; font-weight: bold;"
        : level === "error"
        ? "color: red; font-weight: bold;"
        : "";

    if (context) {
      console.groupCollapsed(`%c${label} - ${message}`, style);
      for (const [key, value] of Object.entries(context)) {
        console.log(`${key}:`, value);
      }
      console.groupEnd();
    } else {
      console.log(`${label} - ${message}`);
    }
  }
}

/** Shared application logger */
export const logger = new Logger();
