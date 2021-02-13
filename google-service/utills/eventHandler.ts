import EventManager from 'rabbitmq-event-manager';
import {
  GoogleSheetEmailAndMsgHandler,
  GoogleSheetEmailAndTagHandler,
} from './googleHandlers/googleSheetHandler';
import {
  IEventHandler,
  IObjectWithInformationAboutEmailAndValue,
} from './InterfacesAndTypes';

export class EventHandler implements IEventHandler {
  private eventMenager = new EventManager({
    url: 'amqp://guest:guest@rabbitmq:5672',
    application: 'google-microservice',
  });
  private googleSheetEmailAndTagHandler = new GoogleSheetEmailAndTagHandler();
  private googleSheetEmailAndMsgHandler = new GoogleSheetEmailAndMsgHandler();
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

  public startListening(): void {
    this.eventMenager
      .on('EMAIL_WITH_TAG', async (payload) => {
        const { email, tag } = payload;
        const informationAboutEmailAndTag: IObjectWithInformationAboutEmailAndValue = await this.googleSheetEmailAndTagHandler.handleSavingEmailAndTagToSheet(
          email,
          tag
        );
        if (
          informationAboutEmailAndTag.emailAlreadyExist &&
          !informationAboutEmailAndTag.valueAlreadyExist
        ) {
          this.eventMenager.emit('NEW_TAG_ADDED_TO_EMAIL', { email, tag });
        }
        return { info: informationAboutEmailAndTag };
      })
      .catch((err) => {
        console.log(
          'Problem with handling EMAIL_WITH_TAG on EventHandler!: ',
          err
        );
        const errorToReturn = new Error('Problem with saving changes!');
        return errorToReturn;
      });
    this.eventMenager.on('MESSAGE_OPEN', async (payload) => {
      const { email, msgId } = payload;
      await this.googleSheetEmailAndMsgHandler
        .handleSavingEmailAndMsgToSheet(email, msgId)
        .catch((err) => {
          console.log(
            'Problem with handling MESSAGE_OPEN on EventHandler!: ',
            err
          );
        });
    });
  }
}
