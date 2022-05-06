import os from "os";
import util from "util";
import { createLogger, format, transports, addColors } from "winston";

const { combine, timestamp, colorize, printf, splat } = format;
const colorFormatter = colorize();

/**
 * Logger class to fetch instances for logging with custom formatting enabled
 */

const customLogLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    verbose: 5,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "cyan",
    verbose: "gray",
    timestamp: "magenta",
    hostname: "cyan",
    uuid: "green",
    label: "magenta",
    country: "blue",
  },
};
addColors(customLogLevels.colors);

export class LoggerClass {
  constructor({ fileName = "logs/error.log" } = {}) {
    const self = this;
    this.fileName = fileName;
    this.hostName = os.hostname();
    const isFileLogEnabled = true; // process.env.ENABLE_FILE_LOG === "true";

    this.transports = [
      new transports.Console(),
      ...(isFileLogEnabled
        ? [
            new transports.File({
              filename: self.fileName,
              zippedArchive: true,
              maxSize: "500m",
              maxFiles: "5",
            }),
          ]
        : []),
    ];

    this.exceptionHandlers = isFileLogEnabled
      ? [
          new transports.File({
            filename: "logs/exceptions.log",
            zippedArchive: true,
            maxSize: "500m",
            maxFiles: "5",
          }),
        ]
      : [new transports.Console()];
  }

  getColorized(lookup, message) {
    return colorFormatter.colorize(lookup, message);
  }

  /**
   * Get the logger instance with request identifiers as part of formatter
   *
   * @param {String} loggerName Name to identify the log initiator
   * @param {String} sessionId unique identifier
   */
  getLogger() {
    const self = this;

    const msgFormat = printf(({ level, message, timestamp: ts, noPrefix }) => {
      // print a simple log without any prefix
      if (noPrefix) {
        return util.formatWithOptions({ colors: true }, message);
      }

      const logTimeStamp = this.getColorized("timestamp", ts);
      const hostName = this.getColorized("hostname", this.hostName);

      return `[${logTimeStamp}] [${hostName}] ${level} # ${message}`;
    });

    return createLogger({
      level: process.env.LOG_LEVEL || "info",
      levels: customLogLevels.levels,
      filename: self.fileName,
      format: combine(timestamp(), colorize(), splat(), msgFormat),
      transports: self.transports,
      exceptionHandlers: self.exceptionHandlers,
      exitOnError: false,
    });
  }
}
const loggerObj = new LoggerClass().getLogger();
export default loggerObj;
