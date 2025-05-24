import { Category } from '@discordx/utilities'
import { CommandInteraction } from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash } from '@/decorators'
import { Disabled, Guard } from '@/guards'
import { Database, Google } from '@/services'

@Discord()
@Injectable()
@Category('Admin')
export default class MigrateCommand {

	constructor(
		private db: Database,
		private google: Google
	) {
	}

	@Slash({ name: 'migrate' })
	@Guard(
		Disabled
	)
	async migrate(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		await interaction.followUp('Migrating data...')
		await this.google.migrate()
		await interaction.editReply('Data migrated successfully!')
	}

}