export interface IObjectWithInformationAboutEmailAndValue {
  emailAlreadyExist: boolean;
  valueAlreadyExist: boolean;
}
export interface IResponse {
  msg: string;
  statusCode: number;
}
export interface IServerConstants {
  eventHandler: EventHandler;
  imagePath: string;
  port: number;
  userErrorCode: number;
  succesCode: number;
  serverErrorCode: number;
}

export interface IEventHandler {
  eventMenager: EventManager;
  emitEmailWithTag(
    email: string,
    tag: string
  ): Promise<IObjectWithInformationAboutEmailAndValue>;
  emitEmailWithMsgId(email: string, msgId: string): Promise<IEventPayload>;
}
