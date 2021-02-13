import EventManager from 'rabbitmq-event-manager';
import { IEventHandler } from '../IntefacesAndTypes';
import { EmailHandler } from './nodemailer';

export class EventHandler implements IEventHandler {
  private eventMenager = new EventManager({
    url: 'amqp://guest:guest@rabbitmq:5672',
    application: 'email-service',
  });
  private emailhandler = new EmailHandler();
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
    this.eventMenager.on('NEW_TAG_ADDED_TO_EMAIL', (payload) => {
      const { email, tag } = payload;
      this.emailhandler.sendEmail(email, tag);
    });
  }
}
