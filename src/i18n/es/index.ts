/* eslint-disable */
import type { Translation } from '../i18n-types'

const es = {
	GUARDS: {
		DISABLED_COMMAND: 'Este comando está deshabilitado actualmente.',
		MAINTENANCE: 'Este bot está en modo mantenimiento.',
		GUILD_ONLY: 'Este comando solo se puede usar en un servidor.',
		NSFW: 'Este comando solo se puede usar en un canal NSFW.',
	},
	ERRORS: {
		UNKNOWN: 'Ocurrió un error desconocido.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'No se proporcionó descripción.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: '¡Invita el bot a tu servidor!',
			EMBED: {
				TITLE: '¡Invítame a tu servidor!',
				DESCRIPTION: '[Haz clic aquí]({link}) para invitarme!',
			},
		},
		PREFIX: {
			NAME: 'prefijo',
			DESCRIPTION: 'Cambia el prefijo del bot.',
			OPTIONS: {
				PREFIX: {
					NAME: 'nuevo_prefijo',
					DESCRIPTION: 'El nuevo prefijo del bot.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Prefijo cambiado a `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Establece el modo mantenimiento del bot.',
			EMBED: {
				DESCRIPTION: 'Modo mantenimiento establecido a `{state}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Obtén estadísticas sobre el bot.',
			HEADERS: {
				COMMANDS: 'Comandos',
				GUILDS: 'Servidores',
				ACTIVE_USERS: 'Usuarios activos',
				USERS: 'Usuarios',
			},
		},
		HELP: {
			DESCRIPTION: 'Obtén ayuda global sobre el bot y sus comandos',
			EMBED: {
				TITLE: 'Panel de ayuda',
				CATEGORY_TITLE: 'Comandos de {category}',
			},
			SELECT_MENU: {
				TITLE: 'Selecciona una categoría',
				CATEGORY_DESCRIPTION: 'Comandos de {category}',
			},
		},
		PING: {
			DESCRIPTION: '¡Pong!',
			MESSAGE: '{member} ¡Pong! El tiempo de ida y vuelta del mensaje fue de {time}ms.{heartbeat}',
		},
		SYNC: {
			DESCRIPTION: 'Sincroniza manualmente con Google Docs.',
			SUCCESS: 'Sincronización completada correctamente.',
			ERROR: 'Error durante la sincronización: {error}',
			CONFLICTS_TITLE: 'Conflictos o anomalías detectadas durante la sincronización:',
			MEMBERS_TITLE: 'Miembros',
			MANUFACTURERS_TITLE: 'Fabricantes',
			SHIPS_TITLE: 'Naves',
			CONFLICT_ADD_DB: 'Añadido a la base de datos: {name}',
			CONFLICT_ADD_SHEET: 'Añadido a Google Sheets: {name}',
			CONFLICT_REMOVE_DB: 'Eliminado de la base de datos: {name}',
			CONFLICT_REMOVE_SHEET: 'Eliminado de Google Sheets: {name}',
			CONFLICT_ERROR: 'Error: {error}',
		},
	},
} satisfies Translation

export default es
