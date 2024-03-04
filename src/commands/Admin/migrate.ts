import {Discord, Slash} from "@/decorators";
import {injectable} from "tsyringe";
import {Category} from "@discordx/utilities";
import {Database, Google} from "@/services";
import {Disabled, Guard, UserPermissions} from "@/guards";
import {CommandInteraction} from "discord.js";
import {Client} from "discordx";

@Discord()
@injectable()
@Category('Admin')
export default class MigrateCommand {

    constructor(
        private db: Database,
        private google: Google
    ) {
    }

    @Slash({name: 'migrate'})
    @Guard(
        Disabled
    )
    async migrate(
        interaction: CommandInteraction,
        client: Client,
        {localize}: InteractionData
    ) {
        await interaction.followUp("Migrating data...");
        await this.google.migrate();
        await interaction.editReply("Data migrated successfully!");
    }
}