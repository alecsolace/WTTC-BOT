import { Category } from '@discordx/utilities'
import {
	ApplicationCommandOptionType,
	AutocompleteFocusedOption,
	AutocompleteInteraction,
	CommandInteraction,
	EmbedBuilder,
} from 'discord.js'
import { Client } from 'discordx'
import { Vehicle } from 'src/utils/types/vehicle'

import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Manufacturer, Ship } from '@/entities'
import { Guard } from '@/guards'
import { Database, VehicleService } from '@/services'

@Discord()
@Category('General')
@Injectable()
export default class ShipCommand {

	constructor(private vehicleService: VehicleService, private db: Database) {
	}

	@Slash({
		name: 'ship',
		description: 'Get information about any ship!',
	})
	@Guard()
	async ship(
        @SlashOption({
        	name: 'manufacturer',
        	type: ApplicationCommandOptionType.String,
        	required: true,
        	autocomplete: true,
        	description: 'The manufacturer of the ship',
        })
            brand: string,
        @SlashOption({
        	name: 'model',
        	type: ApplicationCommandOptionType.String,
        	required: true,
        	autocomplete: true,
        	description: 'The model of the ship',
        })
            model: string,
            interaction: CommandInteraction | AutocompleteInteraction,
            client: Client,
            { localize }: InteractionData
	) {
		if (interaction instanceof AutocompleteInteraction) {
			const focusedOption: AutocompleteFocusedOption = this.getFocusedOption(interaction)
			let limitedArray: string[] = []
			if (focusedOption.name === 'manufacturer') {
				const manufacturer = await this.db.get(Manufacturer).findAutoComplete(focusedOption.value)
				limitedArray = manufacturer.map(manufacturer => manufacturer.name)
			} else if (focusedOption.name === 'model') {
				const ships = await this.db.get(Ship).findAutoCompleteWManufacturer(focusedOption.value, brand)
				limitedArray = ships.map(ship => ship.model)
			}

			return await this.respondWithManufacturers(interaction, limitedArray)
		} else {
			const vehicleName = model.replace(/ /g, '_')
			const vehicle = await this.vehicleService.getVehicleData(vehicleName)
			const embed = this.createVehicleEmbed(vehicle)
			await interaction.followUp({ embeds: [embed] })
		}
	}

	getFocusedOption(
		interaction: AutocompleteInteraction
	): AutocompleteFocusedOption {
		return interaction.options.getFocused(true)
	}

	async respondWithManufacturers(
		interaction: AutocompleteInteraction,
		manufacturers: string[]
	) {
		return interaction.respond(
			manufacturers.map(manufacturer => ({
				name: manufacturer,
				value: manufacturer,
			}))
		)
	}

	createVehicleEmbed(vehicle: Vehicle): EmbedBuilder {
		const embed = new EmbedBuilder()
			.setTitle(vehicle.name ?? '')
			.setDescription(vehicle.description ?? '')
			.addFields([
				{ name: 'Manufacturer', value: vehicle.manufacturer ?? '', inline: true },
				{ name: 'Role', value: vehicle.role ?? '', inline: true },
				{ name: 'Crew', value: vehicle.crew ?? '', inline: true },
				{ name: 'Cargo', value: vehicle.cargo?.toString() ?? '', inline: true },
				{ name: 'Length', value: vehicle.length?.toString() ?? '', inline: true },
				{ name: 'Height', value: vehicle.height?.toString() ?? '', inline: true },
				{ name: 'Beam', value: vehicle.beam?.toString() ?? '', inline: true },
				{ name: 'Mass', value: vehicle.mass?.toString() ?? '', inline: true },
				{ name: 'Combat Speed', value: vehicle.combatSpeed?.toString() ?? '', inline: true },
				{ name: 'After Burner', value: vehicle.afterBurner?.toString() ?? '', inline: true },
				{ name: 'Max Speed', value: vehicle.maxSpeed?.toString() ?? '', inline: true },
				{ name: 'Pitch', value: vehicle.pitch?.toString() ?? '', inline: true },
				{ name: 'Yaw', value: vehicle.yaw?.toString() ?? '', inline: true },
				{ name: 'Roll', value: vehicle.roll?.toString() ?? '', inline: true },
				{ name: 'Acceleration', value: this.getAccelerationValue(vehicle.acceleration), inline: true },
				{ name: 'Ingame Price', value: vehicle.ingamePrice?.toString() ?? '', inline: true },
				{ name: 'Pledge Price', value: vehicle.pledgePrice?.toString() ?? '', inline: true },
				{ name: 'Status', value: vehicle.status ?? '', inline: true },
			])
		if (vehicle.imageUrl) embed.setThumbnail(vehicle.imageUrl)

		return embed
	}

	getAccelerationValue(acceleration: Vehicle['acceleration']): string {
		return `Main: ${acceleration.main ?? ''}, Retro: ${acceleration.retro ?? ''}, VTOL: ${acceleration.vtol ?? ''}`
	}

}