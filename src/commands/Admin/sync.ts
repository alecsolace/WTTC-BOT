import { Category } from '@discordx/utilities'
import { CommandInteraction } from 'discord.js'
import { Client } from 'discordx'

import { Discord, Injectable, Slash } from '@/decorators'
import { Guard, UserPermissions } from '@/guards'
import { SyncService } from '@/services'

@Discord()
@Injectable()
@Category('Admin')
export default class SyncCommand {

	constructor(private readonly syncService: SyncService) { }

	@Slash({ name: 'sync' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async sync(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		await interaction.deferReply({ ephemeral: true })
		try {
			await this.syncService.syncAll()
			// TODO: Implement anomaly analysis and interactive conflict resolution flow
			await interaction.editReply(localize.COMMANDS.SYNC.SUCCESS())
		} catch (error: any) {
			await interaction.editReply(localize.COMMANDS.SYNC.ERROR({ error: error?.message ?? error }))
		}
	}

}
