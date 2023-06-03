import {Client} from "discordx";
import {Category} from "@discordx/utilities";
import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
    EmbedBuilder,
    EmbedField
} from "discord.js";

import {Discord, Slash, SlashChoice, SlashOption} from "@decorators";
import {Guard} from "@guards";
import {injectable} from "tsyringe";
import {Google} from "@services";
import members from "../../../members.json";


@Discord()
@injectable()
@Category("General")
export default class MemberFleetCommand {

    private manufacturers: string[] = [];

    constructor(private google: Google) {
    }

    @Slash({
        name: "memberfleet",
        description: "Returns a list of your owned ships!",
    })
    @Guard()
    async memberFleet(
        @SlashOption({
            name: "member",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: (interaction) => {
                const focusedOption = interaction.options.getFocused(true);
                const choices = members;
                const filtered = choices.filter((choice) =>
                    choice.startsWith(focusedOption.value)
                );
                const limitedResults = filtered.slice(0, 25); // Limit the results to the first 25 values to follow Discord.js guidelines

                return interaction.respond(
                    limitedResults.map((choice) => ({
                        name: choice,
                        value: choice,
                    }))
                );
            },
        }) member: string,
        interaction: CommandInteraction,
        client: Client,
        {localize}: InteractionData
    ) {
        await interaction.followUp("Searching for ships...");
        const memberShips = await this.findShips(member);
        if (memberShips.length === 0) {
            await interaction.editReply(`Could not find ships for member: ${member}`);
            return;
        }
        const embeddedMessage = new EmbedBuilder()
            .setTitle(memberShips[0].owner!)
            .setColor("Aqua")
            .setAuthor({name: "WTTC-Bot"})
            .setTimestamp()
            .setFooter({text: "WTTC-Bot"})
            .setDescription(`The ships owned by ${memberShips[0].owner!}`);

        this.manufacturers.forEach((manufacturer) => {
            let ships: string = "";
            memberShips.forEach((ship) => {
                if (ship.manufacturer === manufacturer) {
                    ships += "\n" + ship.model;
                }
            });
            let fields: EmbedField = {
                name: manufacturer,
                value: ships,
                inline: true,
            };
            embeddedMessage.addFields([fields]);
        });

        await interaction.editReply({embeds: [embeddedMessage]});
    }

    async findShips(member: string) {
        let ships = await this.google.getMemberShips();
        let ownedShips = ships.filter(
            (ship) => {
                try {
                    return ship.owner?.toLowerCase() == member?.toLowerCase()
                } catch (e) {
                    console.error(e)
                }
            }
        );

        ownedShips.forEach((ship) => {
            if (!this.manufacturers.includes(ship.manufacturer)) {
                this.manufacturers.push(ship.manufacturer);
            }
        });
        return ownedShips;
    }

}
