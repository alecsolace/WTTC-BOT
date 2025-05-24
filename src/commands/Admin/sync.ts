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
			const anomalies = await this.syncService.syncAll()

			const hasConflicts = Object.values(anomalies).some((arr: any) => Array.isArray(arr) && arr.length > 0)
			if (!hasConflicts) {
				await interaction.editReply(localize.COMMANDS.SYNC.SUCCESS())

				return
			}

			// Build a localized report of anomalies/conflicts
			let report = `⚠️ ${localize.COMMANDS.SYNC.CONFLICTS_TITLE()}`
			for (const [key, arr] of Object.entries(anomalies)) {
				if (Array.isArray(arr) && arr.length > 0) {
					let sectionTitle = ''
					if (key === 'members') sectionTitle = localize.COMMANDS.SYNC.MEMBERS_TITLE()
					else if (key === 'manufacturers') sectionTitle = localize.COMMANDS.SYNC.MANUFACTURERS_TITLE()
					else if (key === 'ships') sectionTitle = localize.COMMANDS.SYNC.SHIPS_TITLE()
					else sectionTitle = key
					report += `\n**${sectionTitle}**:`
					for (const c of arr) {
						let detail = ''
						if (c.type === 'add-db') detail = localize.COMMANDS.SYNC.CONFLICT_ADD_DB({ name: c.name || c.ship?.model || '' })
						else if (c.type === 'add-sheet') detail = localize.COMMANDS.SYNC.CONFLICT_ADD_SHEET({ name: c.name || c.ship?.model || '' })
						else if (c.type === 'remove-db') detail = localize.COMMANDS.SYNC.CONFLICT_REMOVE_DB({ name: c.name || c.ship?.model || '' })
						else if (c.type === 'remove-sheet') detail = localize.COMMANDS.SYNC.CONFLICT_REMOVE_SHEET({ name: c.name || c.ship?.model || '' })
						else if (c.type === 'error') detail = localize.COMMANDS.SYNC.CONFLICT_ERROR({ error: c.error })
						else detail = JSON.stringify(c)
						report += `\n- ${detail}`
					}
				}
			}
			await interaction.editReply({ content: report })

			// Interactive flow placeholder (see documentation below)
			// TODO: Implement Discord components (buttons/selects) for user conflict resolution
			// All user-facing strings must use i18n/localize
		} catch (error: any) {
			await interaction.editReply(localize.COMMANDS.SYNC.ERROR({ error: error instanceof Error ? error.message : String(error) }))
		}
	}

}
