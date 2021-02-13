import EventManager from 'rabbitmq-event-manager';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

export type SheetCellKey = 'tag' | 'msgId';

export interface IObjectWithInformationAboutEmailAndValue {
  emailAlreadyExist: boolean;
  valueAlreadyExist: boolean;
}

export interface IGoogleSheetEmailAndTagHandler {
  handleSavingEmailAndTagToSheet(
    emailToAdd: string,
    tagToAdd: string
  ): Promise<IObjectWithInformationAboutEmailAndValue>;
}
export interface IGoogleSheetEmailAndMsgHandle {
  handleSavingEmailAndMsgToSheet(
    emailToCheck: string,
    msgToAdd: string
  ): Promise<IObjectWithInformationAboutEmailAndValue>;
}
export interface IEventHandler {
  startListening(): void;
}
export interface IServerConstants {
  eventMenager: IEventHandler;
  port: number;
}
