import {Client} from 'discordx'
import {Category} from '@discordx/utilities'
import {
    ApplicationCommandOptionType,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    CommandInteraction, EmbedBuilder, EmbedField
} from 'discord.js'

import {Discord, Slash, SlashOption} from '@decorators'
import {Guard} from '@guards'
import {Google, Logger} from "@services";
import {injectable} from "tsyringe";

@Discord()
@injectable()
@Category('General')
export default class BrandCommand {

    constructor(private google: Google, private logger: Logger) {
    }

    @Slash({
        name: 'brand',
        description: 'Get all the ships by brand!'
    })
    @Guard()
    async brand(
        @SlashOption({
            name: "manufacturer",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }) brand: string,
        interaction: CommandInteraction | AutocompleteInteraction,
        client: Client,
        {localize}: InteractionData
    ) {
        if (interaction instanceof AutocompleteInteraction) {
            const ships = await this.google.getManufacturers();
            const focusedOption: AutocompleteFocusedOption = interaction.options.getFocused(true);
            const choices: string[] = Object.keys(ships);
            const filtered: string[] = choices.filter((choice: string) =>
                choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
            );
            const limitedResults: string[] = filtered.slice(0, 25); // Limit the results to the first 25 values to follow Discord.js guidelines
            return interaction.respond(
                limitedResults.map((choice: any) => ({
                    name: choice,
                    value: choice,
                }))
            );
        }


        await interaction.followUp("Searching for ships...");
        this.logger.console(`Searching for ships for: ${brand}`, "info")
        const ships: string = await this.findShips(brand);
        if (ships.length == 0) {
            await interaction.editReply(`Could not find ships for: ${brand}`);
            return;
        }
        const embeddedMessage = new EmbedBuilder()
            .setTitle(brand)
            .setColor("Aqua")
            .setAuthor({name: "WTTC-Bot"})
            .setTimestamp()
            .setFooter({text: "WTTC-Bot"})
            .setDescription(
                `The brand ${brand} has the following ships: `
            );

        let field: EmbedField = {
            name: brand,
            value: ships,
            inline: true,
        };
        embeddedMessage.addFields([field]);

        await interaction.editReply({embeds: [embeddedMessage]});
    }

    async findShips(brand: string): Promise<string> {
        let shipString = "";
        try {
            let ships = await this.google.getManufacturers();
            let formattedShips: { manufacturer: string, model: string }[] = []
            for (const manufacturer in ships) {
                const models = ships[manufacturer];
                for (const modelObj of models) {
                    const {model} = modelObj;
                    formattedShips.push({manufacturer, model});
                }
            }
            let ownedShips: any[] = formattedShips.filter((ship: any) =>
                ship.manufacturer === brand
            );
            ownedShips.forEach((ship) => {
                shipString += `${ship.model} \n`;
            });
        } catch (e) {
            console.log(e);
        }
        return shipString;
    }

}