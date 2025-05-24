/* eslint-disable */
import type { Translation } from '../i18n-types'

const es = {
	COMMANDS: {
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
