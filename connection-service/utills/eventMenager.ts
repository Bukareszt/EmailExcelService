import EventManager from 'rabbitmq-event-manager';
import { IEventPayload } from 'rabbitmq-event-manager/build/lib/interfaces';
import {
  IEventHandler,
  IObjectWithInformationAboutEmailAndValue,
} from '../InterfacesAndTypes';

export class EventHandler implements IEventHandler {
  public eventMenager = new EventManager({
    url: 'amqp://guest:guest@rabbitmq:5672',
    application: 'connection-service',
  });
  constructor() {
    this.eventMenager
      .initialize()
      .then((res) => {
        console.info('Event menager is listening!');
      })
      .catch((err) => {
        console.error('Problem with connection to rabbitMq');
      });
  }

  public emitEmailWithTag(
    email: string,
    tag: string
  ): Promise<IObjectWithInformationAboutEmailAndValue> {
    return this.eventMenager
      .emitAndWait('EMAIL_WITH_TAG', { email: email, tag: tag })
      .then((res) => {
        const informationAboutEmailAndTags: IObjectWithInformationAboutEmailAndValue = {
          emailAlreadyExist: res.info.emailAlreadyExist,
          valueAlreadyExist: res.info.valueAlreadyExist,
        };
        return informationAboutEmailAndTags;
      });
  }
  public emitEmailWithMsgId(
    email: string,
    msgId: string
  ): Promise<IEventPayload> {
    return this.eventMenager.emit('MESSAGE_OPEN', {
      email: email,
      msgId: msgId,
    });
  }
}
