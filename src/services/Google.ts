import {singleton} from "tsyringe";

import {Logger} from "@services";
import {GoogleSpreadsheet} from "google-spreadsheet";
import * as process from "process";
import {groupBy} from "../utils/functions/object";
import {Schedule} from "@decorators";
import fs from "fs";

@singleton()
export class Google {
    private doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID as string);

    constructor(private logger: Logger) {
        this.logger.console(process.env.SPREADSHEET_ID as string, "info")
        this.logger.console(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string, "info")
        this.logger.console(process.env.GOOGLE_PRIVATE_KEY as string, "info")

        this.accessSpreadsheet().catch((e) => this.logger.file(e, "error"));
        this.logger.console("Service Google invoked !", "info");
    }

    async accessSpreadsheet() {
        await this.doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL! as string,
            private_key: process.env.GOOGLE_PRIVATE_KEY! as string,
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

    async getManufacturers() {
        await this.doc.loadInfo();
        const sheet = this.doc.sheetsByIndex[2];
        await sheet.loadHeaderRow(3);
        const rows = await sheet.getRows();

        let ships: { manufacturer: string; model: string }[] = [];
        rows.forEach((row) => {
            if (row.Name != null) {
                let ship: { manufacturer: string; model: string } = {
                    manufacturer: row.Manufacturer,
                    model: row.Name,
                };
                ships.push(ship);
            }
        });
        return groupBy(ships, "manufacturer");
    }

    @Schedule('0 0 * * *')
    async updateFiles() {
        this.getMembers().then(x => {
            fs.writeFile(
                'members.json', JSON.stringify(x), "utf-8", (error) => {
                    if (error) this.logger.logError(error, "Exception")
                    this.logger.console('Members file updated')
                }
            )
        })

        this.getMemberShips().then(x => {
            fs.writeFile(
                'ships.json', JSON.stringify(x), "utf-8", (error) => {
                    if (error) this.logger.logError(error, "Exception")
                    this.logger.console('Ships file updated')
                }
            )
        })
    }
}
