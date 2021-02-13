import dotenv from 'dotenv';
import express from 'express';
import { EventHandler } from './utills/eventHandler';
import { IServerConstants } from './utills/InterfacesAndTypes';
dotenv.config();

const app = express();
app.use(express.json());

const CONSTANTS: IServerConstants = {
  eventMenager: new EventHandler(),
  port: 3001,
};

app.listen(CONSTANTS.port, () => {
  console.log(`Google-serivice listen on ${CONSTANTS.port} !`);
  CONSTANTS.eventMenager.startListening();
});
