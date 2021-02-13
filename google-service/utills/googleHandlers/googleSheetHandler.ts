import {
  IGoogleSheetEmailAndMsgHandle,
  IGoogleSheetEmailAndTagHandler,
  IObjectWithInformationAboutEmailAndValue,
} from '../InterfacesAndTypes';
import { GoogleHandler } from './googleHandler.abstract';

export class GoogleSheetEmailAndTagHandler
  extends GoogleHandler
  implements IGoogleSheetEmailAndTagHandler {
  constructor() {
    super();
  }
  public async handleSavingEmailAndTagToSheet(
    emailToAdd: string,
    tagToAdd: string
  ): Promise<IObjectWithInformationAboutEmailAndValue> {
    await this.preaperDocumentToWork();
    const infoAboutEmailAndTag: IObjectWithInformationAboutEmailAndValue = await this.handleEmailAndValueExist(
      emailToAdd,
      'tag',
      tagToAdd
    );
    if (!infoAboutEmailAndTag.emailAlreadyExist) {
      this.addEmailWithValue(emailToAdd, tagToAdd, 'tag');
    }
    return infoAboutEmailAndTag;
  }
}

export class GoogleSheetEmailAndMsgHandler
  extends GoogleHandler
  implements IGoogleSheetEmailAndMsgHandle {
  constructor() {
    super();
  }
  public async handleSavingEmailAndMsgToSheet(
    emailToCheck: string,
    msgToAdd: string
  ): Promise<IObjectWithInformationAboutEmailAndValue> {
    await this.preaperDocumentToWork();
    const infoAboutEmailAndMsg: IObjectWithInformationAboutEmailAndValue = await this.handleEmailAndValueExist(
      emailToCheck,
      'msgId',
      msgToAdd
    );
    return infoAboutEmailAndMsg;
  }
}
