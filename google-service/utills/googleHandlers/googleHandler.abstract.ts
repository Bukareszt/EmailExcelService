import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from 'google-spreadsheet';
import {
  SheetCellKey,
  IObjectWithInformationAboutEmailAndValue,
} from '../InterfacesAndTypes';

export abstract class GoogleHandler {
  protected documentToWorkWith: GoogleSpreadsheet;
  protected sheetToWorkWith!: GoogleSpreadsheetWorksheet;
  constructor() {
    this.documentToWorkWith = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID!
    );
    this.documentToWorkWith.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!,
    });
  }

  protected async preaperDocumentToWork(): Promise<void> {
    await this.documentToWorkWith.loadInfo();
    this.sheetToWorkWith = this.documentToWorkWith.sheetsByIndex[0];
  }

  private async checkCellIsUpdateAndSave(
    rowsFromSheetsToCheck: GoogleSpreadsheetRow[],
    flagCheckBy: SheetCellKey,
    valueToAdd: string,
    indexToCheck: number
  ): Promise<boolean> {
    const rowToCheck: string = rowsFromSheetsToCheck[indexToCheck][flagCheckBy];
    if (!rowToCheck) {
      rowsFromSheetsToCheck[indexToCheck][flagCheckBy] = valueToAdd;
      await rowsFromSheetsToCheck[indexToCheck].save();
      return false;
    }
    if (rowToCheck.includes(valueToAdd)) {
      return true;
    }

    rowsFromSheetsToCheck[indexToCheck][flagCheckBy] = rowToCheck.concat(
      ' ',
      valueToAdd
    );
    await rowsFromSheetsToCheck[indexToCheck].save();

    return false;
  }

  protected async addEmailWithValue(
    emailToAdd: string,
    valueToAdd: string,
    flagValueName: SheetCellKey
  ): Promise<void> {
    const objectToAdd = { email: emailToAdd, [flagValueName]: valueToAdd };
    const rowsToAdd = await this.sheetToWorkWith.addRow(objectToAdd);
  }

  protected async handleEmailAndValueExist(
    emailToCheck: string,
    valueToCheck: SheetCellKey,
    valueToAdd: string
  ) {
    const objectWithInformationAboutEmailAndValue: IObjectWithInformationAboutEmailAndValue = {
      emailAlreadyExist: false,
      valueAlreadyExist: false,
    };
    const rowsFromSheetsToCheck = await this.sheetToWorkWith.getRows();

    for (
      let indexToCheck = 0;
      indexToCheck < rowsFromSheetsToCheck.length;
      indexToCheck++
    ) {
      if (rowsFromSheetsToCheck[indexToCheck].email === emailToCheck) {
        objectWithInformationAboutEmailAndValue.emailAlreadyExist = true;
        objectWithInformationAboutEmailAndValue.valueAlreadyExist = await this.checkCellIsUpdateAndSave(
          rowsFromSheetsToCheck,
          valueToCheck,
          valueToAdd,
          indexToCheck
        );
      }
    }
    return objectWithInformationAboutEmailAndValue;
  }
}
