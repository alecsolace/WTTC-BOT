import { Service } from "@/decorators";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import * as process from "process";

@Service()
export class GoogleSheetsService {
  private serviceAccountJWT = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  private doc: GoogleSpreadsheet;

  constructor() {
    this.doc = new GoogleSpreadsheet(
      process.env.SPREADSHEET_ID as string,
      this.serviceAccountJWT
    );
  }

  async accessSpreadsheet() {
    await this.doc.loadInfo();
  }

  async getSheetByIndex(index: number) {
    await this.accessSpreadsheet();
    return this.doc.sheetsByIndex[index];
  }

  async getRows(index: number, headerRow: number = 1) {
    const sheet = await this.getSheetByIndex(index);
    await sheet.loadHeaderRow(headerRow);
    return sheet.getRows();
  }

  async addRow(index: number, row: Record<string, any>, headerRow: number = 1) {
    const sheet = await this.getSheetByIndex(index);
    await sheet.loadHeaderRow(headerRow);
    await sheet.addRow(row);
  }

  async updateRow(row: any, data: Record<string, any>) {
    Object.assign(row, data);
    await row.save();
  }

  async deleteRow(row: any) {
    await row.delete();
  }
}
