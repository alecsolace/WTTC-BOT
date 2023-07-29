import {Client} from 'discordx'
import {Category} from '@discordx/utilities'
import {
    ApplicationCommandOptionType,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    CommandInteraction
} from 'discord.js'

import {Discord, Slash, SlashOption} from '@decorators'
import {Guard} from '@guards'
import {injectable} from "tsyringe";
import {Google, Logger} from "@services";

@Discord()
@Category('General')
@injectable()
export default class ShipCommand {

    constructor(private google: Google) {
    }

    @Slash({
        name: 'ship',
        description: 'Get information about any ship!'
    })
    @Guard()
    async ship(
        @SlashOption({
            name: "manufacturer",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }) brand: string,
        @SlashOption({
            name: "model",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }) model: string,
        interaction: CommandInteraction | AutocompleteInteraction,
        client: Client,
        {localize}: InteractionData,
    ) {

        if (interaction instanceof AutocompleteInteraction) {
            const {ships} = this.google;
            const focusedOption: AutocompleteFocusedOption = this.getFocusedOption(interaction)
            let uniqueArray;
            let filteredArray;
            let limitedArray: string[] = [];
            if (focusedOption.name === "manufacturer") {
                uniqueArray = this.getUniqueManufacturers(ships);
                filteredArray = this.filterByFocusedOption(uniqueArray, focusedOption);
                limitedArray = this.limitResults(filteredArray, 25);
            } else if (focusedOption.name === "model") {
                uniqueArray = this.getUniqueModels(ships);
                filteredArray = this.filterByFocusedOption(uniqueArray, focusedOption);
                limitedArray = this.limitResults(filteredArray, 25);
            }

            return await this.respondWithManufacturers(interaction, limitedArray);
        }
        await interaction.followUp("We are working on implementing this command, thank you for your patience.")
    }

    getFocusedOption(interaction: AutocompleteInteraction): AutocompleteFocusedOption {
        return interaction.options.getFocused(true);
    }

    getUniqueManufacturers(ships: any[]): string[] {
        return [...new Set(ships.map(ship => ship.manufacturer))];
    }

    getUniqueModels(ships: any[]): string[] {
        return [...new Set(ships.map(ship => ship.model))];
    }

    filterByFocusedOption(array: string[], focusedOption: AutocompleteFocusedOption): string[] {
        return array.filter(item => item.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
    }

    limitResults(array: string[], limit: number): string[] {
        return array.slice(0, limit);
    }

    async respondWithManufacturers(interaction: AutocompleteInteraction, manufacturers: string[]) {
        return interaction.respond(
            manufacturers.map(manufacturer => ({
                name: manufacturer,
                value: manufacturer,
            }))
        );
    }
}