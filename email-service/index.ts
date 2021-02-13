import { EventHandler } from './utills/eventHandler';
import express from 'express';
import { IServerConstants } from './IntefacesAndTypes';

const CONSTANTS: IServerConstants = {
  eventHandler: new EventHandler(),
  port: 3002,
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(CONSTANTS.port, () => {
  console.log(`Email-service listen on ${CONSTANTS.port}`);

  CONSTANTS.eventHandler.startListening();
});
