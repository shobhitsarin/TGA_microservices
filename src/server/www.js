#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app.js";
import debugLib from "debug";
import http from "http";
import mongoose from "mongoose";
import logger from "../../utils/logger.js";

const debug = debugLib("shobhit-microservice:server");

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP server.
 */

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
});

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
};

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
server.setTimeout(10 * 1000);
