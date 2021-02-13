export interface IEmailHandler {
  sendEmail(email: string, tag: string): void;
}
export interface IEventHandler {
  startListening(): void;
}

export interface IServerConstants {
  eventHandler: IEventHandler;
  port: number;
}
