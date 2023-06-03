import { singleton } from "tsyringe";

import { Logger } from "@services";
import { GoogleSpreadsheet } from "google-spreadsheet";
import * as process from "process";

@singleton()
export class Google {
  private doc = new GoogleSpreadsheet(process.env["SPREADSHEET_ID"]);

  constructor(private logger: Logger) {
    this.accessSpreadsheet().catch((e) => this.logger.file(e, "error"));
    this.logger.console("Service Google invoked !", "info");
  }

  async accessSpreadsheet() {
    await this.doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!,
    });
    await this.doc.loadInfo();
  }

  async getMemberShips() {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[0];
    await sheet.loadHeaderRow(4);
    const rows = await sheet.getRows();

    let ships: {
      manufacturer: string;
      model: string;
      owner: string;
      name?: string;
    }[] = [];
    rows.forEach((row) => {
      let ship: {
        manufacturer: string;
        model: string;
        owner: string;
        name?: string;
      } = {
        manufacturer: row.Manufacturer,
        model: row.Model,
        owner: row.Owner,
        name: row["Ship Name"],
      };
      ships.push(ship);
    });
    return ships;
  }

  async getMembers() {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[3];
    await sheet.loadHeaderRow(3);
    const rows = await sheet.getRows();

    let members: string[] = [];
    rows.forEach((row) => {
      if (row.MEMBER !== "") {
        let member = row.MEMBER as string;
        members.push(member);
      }
    });
    return members;
  }
}
