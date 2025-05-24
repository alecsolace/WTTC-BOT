import { Category } from '@discordx/utilities'
import {
	ApplicationCommandOptionType,
	AutocompleteFocusedOption,
	AutocompleteInteraction,
	CommandInteraction,
	EmbedBuilder,
	EmbedField,
} from 'discord.js'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Manufacturer } from '@/entities'
import { Guard } from '@/guards'
import { Database, Logger, Wiki } from '@/services'

@Discord()
@Injectable()
@Category('General')
export default class BrandCommand {

	constructor(
		private readonly logger: Logger,
		private readonly wiki: Wiki,
		private readonly db: Database
	) {}

	@Slash({
		name: 'manufacturer',
		description: 'Get all the ships by manufacturer!',
	})
	@Guard()
	async brand(
		@SlashOption({
			name: 'brand',
			description: 'Name of the manufacturer',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		}) brand: string,
			interaction: CommandInteraction | AutocompleteInteraction
	) {
		if (interaction instanceof AutocompleteInteraction) {
			const focusedOption: AutocompleteFocusedOption
        = interaction.options.getFocused(true)
			const limitedResults: Manufacturer[] = await this.db
				.get(Manufacturer)
				.findAutoComplete(focusedOption.value)

			return interaction.respond(
				limitedResults.map((choice: Manufacturer) => ({
					name: choice.name,
					value: choice.name,
				}))
			)
		}

		await interaction.followUp('Searching for ships...')
		this.logger.console(`Searching for ships for: ${brand}`, 'info')

		const ships: string = await this.findShips(brand)
		if (ships.length === 0) {
			await interaction.editReply(`Could not find ships for: ${brand}`)

			return
		}
		const brandDescription = await this.getManufacturerDescription(brand)
		const embeddedMessage = new EmbedBuilder()
			.setTitle(brand)
			.setColor('Aqua')
			.setAuthor({ name: 'WTTC-Bot' })
			.setTimestamp()
			.setFooter({ text: 'WTTC-Bot' })
			.setDescription(
        `${brandDescription} \nThe brand ${brand} has the following ships: `
			)

		const field: EmbedField = {
			name: brand,
			value: ships,
			inline: true,
		}
		embeddedMessage.addFields([field])

		await interaction.editReply({ embeds: [embeddedMessage] })
	}

	async findShips(manufacturer: string): Promise<string> {
		let shipString = ''
		const ships = await this.db.get(Manufacturer).getShips(manufacturer)
		ships.forEach((ship) => {
			shipString += `${ship.model} \n`
		})

		return shipString
	}

	async getManufacturerDescription(manufacturer: string): Promise<string> {
		try {
			return await this.wiki.getManufacturer(manufacturer)
		} catch (error) {
			this.logger.console(
        `Error fetching manufacturer's description for: ${manufacturer}`,
        'error'
			)
			throw new Error(
        `Error fetching manufacturer's description for: ${manufacturer}`
			)
		}
	}

}
