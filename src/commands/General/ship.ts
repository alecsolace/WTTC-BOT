import {Client} from 'discordx'
import {Category} from '@discordx/utilities'
import {ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction} from 'discord.js'

import {Discord, Slash, SlashOption} from '@decorators'
import {Guard} from '@guards'

@Discord()
@Category('General')
export default class ShipCommand {

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

		if (interaction instanceof AutocompleteInteraction) {return}
        await interaction.followUp('We are working on this command!')
    }
}