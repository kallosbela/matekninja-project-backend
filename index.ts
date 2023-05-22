import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
const port = process.env.PORT;

import app from './app';
import mongoose from 'mongoose';
import {create} from './utils/createMongoObject';

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI as string).then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${port}`);
  });
  // create();
}).catch((err) => {
  console.log(err);
});

