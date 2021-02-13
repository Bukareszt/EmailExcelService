import express, { Request, Response } from 'express';
import path from 'path';
import {
  IObjectWithInformationAboutEmailAndValue,
  IResponse,
  IServerConstants,
} from './InterfacesAndTypes';
import { EventHandler } from './utills/eventMenager';
import {
  createResponse,
  prepareResponseBasedOnInformation,
} from './utills/response';

const app = express();

const CONSTANTS: IServerConstants = {
  eventHandler: new EventHandler(),
  imagePath: path.resolve('src', 'pngToSendWhenMsgIsRead.png'),
  port: 3000,
  userErrorCode: 400,
  succesCode: 200,
  serverErrorCode: 500,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/add-tag', async (req: Request, res: Response) => {
  let response: IResponse;

  if (
    typeof req.query.email === 'string' &&
    typeof req.query.tag === 'string'
  ) {
    const queryEmail = req.query.email;
    const queryTag = req.query.tag;

    try {
      const informationAboutOperations: IObjectWithInformationAboutEmailAndValue = await CONSTANTS.eventHandler.emitEmailWithTag(
        queryEmail,
        queryTag
      );
      response = prepareResponseBasedOnInformation(informationAboutOperations);
    } catch (err) {
      response = createResponse(err, CONSTANTS.serverErrorCode);
    }
  } else {
    response = createResponse(
      'Wrong query params! Try again with syntax : tag=YOUR_TAGt&email=YOUR_EMAIL',
      CONSTANTS.userErrorCode
    );
  }

  res.status(CONSTANTS.succesCode).send(response);
});

app.get('/was-opened', async (req: Request, res: Response) => {
  let response: IResponse;

  if (
    typeof req.query.email === 'string' &&
    typeof req.query.msgId === 'string'
  ) {
    const queryEmail = req.query.email;
    const queryMsgId = req.query.msgId;

    await CONSTANTS.eventHandler.emitEmailWithMsgId(queryEmail, queryMsgId);
    res.status(CONSTANTS.succesCode).sendFile(CONSTANTS.imagePath);
  } else {
    response = createResponse(
      'Wrong query params! Try again with syntax : msgId=YOUR_TAGt&email=YOUR_EMAIL',
      CONSTANTS.userErrorCode
    );
    res.status(CONSTANTS.userErrorCode).send(response);
  }
});

app.listen(CONSTANTS.port, () => {
  console.log(`Connection-service listen on ${CONSTANTS.port}!`);
});
