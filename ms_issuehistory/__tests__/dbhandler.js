const mongoose = require("mongoose");
import { MongoMemoryServer } from "mongodb-memory-server";
import logger from "../src/utils/logger.js";

let mongod;

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
  };
  try {
    await mongoose.connect(uri, mongooseOpts);
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Insert dummy data for all db collections.
 */
module.exports.insertData = async (key, Data) => {
  const collections = mongoose.connection.collections;
  const collection = collections[key];
  await collection.insertMany(Data);
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
