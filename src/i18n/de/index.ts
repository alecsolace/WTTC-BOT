/* eslint-disable */
import type { Translation } from '../i18n-types'

const de = {
	GUARDS: {
		DISABLED_COMMAND: 'Dieser Befehl ist derzeit deaktiviert.',
		MAINTENANCE: 'Dieser Bot befindet sich derzeit im Wartungsmodus.',
		GUILD_ONLY: 'Dieser Befehl kann nur auf einem Server verwendet werden.',
		NSFW: 'Dieser Befehl kann nur in einem NSFW-Kanal verwendet werden.',
	},
	ERRORS: {
		UNKNOWN: 'Ein unbekannter Fehler ist aufgetreten.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Keine Beschreibung vorhanden.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Lade den Bot auf deinen Server ein!',
			EMBED: {
				TITLE: 'Lade mich auf deinen Server ein!',
				DESCRIPTION: '[Klicke hier]({link}), um mich einzuladen!',
			},
		},
		PREFIX: {
			NAME: 'präfix',
			DESCRIPTION: 'Ändere das Präfix des Bots.',
			OPTIONS: {
				PREFIX: {
					NAME: 'neues_präfix',
					DESCRIPTION: 'Das neue Präfix des Bots.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Präfix geändert zu `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Setze den Wartungsmodus des Bots.',
			EMBED: {
				DESCRIPTION: 'Wartungsmodus gesetzt auf `{state}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Zeige Statistiken über den Bot an.',
			HEADERS: {
				COMMANDS: 'Befehle',
				GUILDS: 'Server',
				ACTIVE_USERS: 'Aktive Nutzer',
				USERS: 'Nutzer',
			},
		},
		HELP: {
			DESCRIPTION: 'Erhalte globale Hilfe über den Bot und seine Befehle',
			EMBED: {
				TITLE: 'Hilfepanel',
				CATEGORY_TITLE: '{category} Befehle',
			},
			SELECT_MENU: {
				TITLE: 'Wähle eine Kategorie',
				CATEGORY_DESCRIPTION: '{category} Befehle',
			},
		},
		PING: {
			DESCRIPTION: 'Pong!',
			MESSAGE: '{member} Pong! Die Antwortzeit betrug {time}ms.{heartbeat}',
		},
		SYNC: {
			DESCRIPTION: 'Manuelle Synchronisierung mit Google Docs.',
			SUCCESS: 'Synchronisierung erfolgreich abgeschlossen.',
			ERROR: 'Fehler während der Synchronisierung: {error}',
			CONFLICTS_TITLE: 'Konflikte oder Anomalien während der Synchronisierung erkannt:',
			MEMBERS_TITLE: 'Mitglieder',
			MANUFACTURERS_TITLE: 'Hersteller',
			SHIPS_TITLE: 'Schiffe',
			CONFLICT_ADD_DB: 'Zur Datenbank hinzugefügt: {name}',
			CONFLICT_ADD_SHEET: 'Zu Google Sheets hinzugefügt: {name}',
			CONFLICT_REMOVE_DB: 'Aus der Datenbank entfernt: {name}',
			CONFLICT_REMOVE_SHEET: 'Aus Google Sheets entfernt: {name}',
			CONFLICT_ERROR: 'Fehler: {error}',
		},
	},
} satisfies Translation

export default de
