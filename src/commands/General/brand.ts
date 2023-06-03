import { Client } from 'discordx'
import { Category } from '@discordx/utilities'
import { CommandInteraction } from 'discord.js'

import { Discord, Slash } from '@decorators'
import { Guard } from '@guards'

@Discord()
@Category('General')
export default class BrandCommand {

	@Slash({
		name: 'brand',
		description: 'Get all the ships by brand!'
	})
	@Guard()
	async brand(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		
		interaction.followUp('brand command invoked!')
	}
}