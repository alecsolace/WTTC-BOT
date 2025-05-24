import { Service } from '@/decorators'
import { Manufacturer, Member, MemberShip, Ship } from '@/entities'

import { GoogleSheetsService } from './GoogleSheetsService'
import { Database, Logger } from './index'

@Service()
export class SyncService {

	constructor(
		private readonly sheets: GoogleSheetsService,
		private readonly db: Database,
		private readonly logger: Logger
	) {
	}

	async syncAll() {
		const anomalies: any = {
			members: await this.syncMembers(),
			manufacturers: await this.syncManufacturers(),
			ships: await this.syncShips(),
		}

		return anomalies
	}

	async syncMembers() {
		const conflicts: any[] = []
		try {
			// Get members from Sheets (index 3, headerRow 3, column "MEMBER")
			await this.sheets.accessSpreadsheet()
			const sheet = await this.sheets.getSheetByIndex(3)
			await sheet.loadHeaderRow(3)
			const sheetRows = await sheet.getRows()
			const sheetMembers = sheetRows
				.map((row: any) => row.get('MEMBER')?.trim())
				.filter((name: string) => !!name)

			// Get members from the database
			const memberRepo = this.db.orm.em.getRepository(Member)
			const dbMembers = await memberRepo.findAll()
			const dbMemberNames = dbMembers.map(m => m.name.trim())

			// Add to DB the members that are in Sheets but not in DB
			for (const name of sheetMembers) {
				if (!dbMemberNames.includes(name)) {
					await this.db.em.persistAndFlush(new Member(name))
					this.logger.log(`Member added to DB from Sheets: ${name}`)
					conflicts.push({ type: 'add-db', name })
				}
			}
			// Add to Sheets the members that are in DB but not in Sheets
			for (const dbMember of dbMembers) {
				if (!sheetMembers.includes(dbMember.name.trim())) {
					await sheet.addRow({ MEMBER: dbMember.name })
					this.logger.log(`Member added to Sheets from DB: ${dbMember.name}`)
					conflicts.push({ type: 'add-sheet', name: dbMember.name })
				}
			}
			// Remove from DB the members that are no longer in Sheets
			for (const dbMember of dbMembers) {
				if (!sheetMembers.includes(dbMember.name.trim())) {
					await this.db.em.removeAndFlush(dbMember)
					this.logger.log(`Member removed from DB because not in Sheets: ${dbMember.name}`)
					conflicts.push({ type: 'remove-db', name: dbMember.name })
				}
			}
			// Remove from Sheets the members that are no longer in DB
			for (const row of sheetRows) {
				if (!dbMemberNames.includes(row.get('MEMBER')?.trim())) {
					await row.delete()
					this.logger.log(`Member removed from Sheets because not in DB: ${row.get('MEMBER')}`)
					conflicts.push({ type: 'remove-sheet', name: row.get('MEMBER') })
				}
			}
			this.logger.log('Members sync completed', 'info')
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : String(error)
			this.logger.log(`Error syncing members: ${errMsg}`, 'error')
			conflicts.push({ type: 'error', error: errMsg })
		}

		return conflicts
	}

	async syncManufacturers() {
		const conflicts: any[] = []
		try {
			// Get manufacturers from Sheets (index 2, headerRow 3, column "Manufacturer")
			await this.sheets.accessSpreadsheet()
			const sheet = await this.sheets.getSheetByIndex(2)
			await sheet.loadHeaderRow(3)
			const sheetRows = await sheet.getRows()
			const sheetManufacturers = sheetRows
				.map((row: any) => row.get('Manufacturer')?.trim())
				.filter((name: string) => !!name)

			// Get manufacturers from the database
			const manufacturerRepo = this.db.orm.em.getRepository(Manufacturer)
			const dbManufacturers = await manufacturerRepo.findAll()
			const dbManufacturerNames = dbManufacturers.map(m => m.name.trim())

			// Add to DB the manufacturers that are in Sheets but not in DB
			for (const name of sheetManufacturers) {
				if (!dbManufacturerNames.includes(name)) {
					await this.db.em.persistAndFlush(new Manufacturer(name))
					this.logger.log(`Manufacturer added to DB from Sheets: ${name}`)
					conflicts.push({ type: 'add-db', name })
				}
			}
			// Add to Sheets the manufacturers that are in DB but not in Sheets
			for (const dbManufacturer of dbManufacturers) {
				if (!sheetManufacturers.includes(dbManufacturer.name.trim())) {
					await sheet.addRow({ Manufacturer: dbManufacturer.name })
					this.logger.log(`Manufacturer added to Sheets from DB: ${dbManufacturer.name}`)
					conflicts.push({ type: 'add-sheet', name: dbManufacturer.name })
				}
			}
			// Remove from DB the manufacturers that are no longer in Sheets
			for (const dbManufacturer of dbManufacturers) {
				if (!sheetManufacturers.includes(dbManufacturer.name.trim())) {
					await this.db.em.removeAndFlush(dbManufacturer)
					this.logger.log(`Manufacturer removed from DB because not in Sheets: ${dbManufacturer.name}`)
					conflicts.push({ type: 'remove-db', name: dbManufacturer.name })
				}
			}
			// Remove from Sheets the manufacturers that are no longer in DB
			for (const row of sheetRows) {
				if (!dbManufacturerNames.includes(row.get('Manufacturer')?.trim())) {
					await row.delete()
					this.logger.log(`Manufacturer removed from Sheets because not in DB: ${row.get('Manufacturer')}`)
					conflicts.push({ type: 'remove-sheet', name: row.get('Manufacturer') })
				}
			}
			this.logger.log('Manufacturers sync completed', 'info')
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : String(error)
			this.logger.log(`Error syncing manufacturers: ${errMsg}`, 'error')
			conflicts.push({ type: 'error', error: errMsg })
		}

		return conflicts
	}

	async syncShips() {
		const conflicts: any[] = []
		try {
			await this.sheets.accessSpreadsheet()
			const sheet = await this.sheets.getSheetByIndex(0)
			await sheet.loadHeaderRow(4)
			const sheetRows = await sheet.getRows()
			const sheetShips = sheetRows.map((row: any) => ({
				manufacturer: row.get('Manufacturer')?.trim(),
				model: row.get('Model')?.trim(),
				owner: row.get('Owner')?.trim(),
				name: row.get('Ship name')?.trim() || undefined,
			})).filter((ship: any) => ship.manufacturer && ship.model && ship.owner)

			// Obtener ships y memberShips de la base de datos
			const shipRepo = this.db.orm.em.getRepository(Ship)
			const memberRepo = this.db.orm.em.getRepository(Member)
			const manufacturerRepo = this.db.orm.em.getRepository(Manufacturer)
			const memberShipRepo = this.db.orm.em.getRepository(MemberShip)
			// const dbShips = await shipRepo.findAll({ populate: ['manufacturer'] })
			// const dbMemberShips = await memberShipRepo.findAll({ populate: ['member', 'ship'] })

			// Sincronizar ships y memberShips desde Sheets a DB
			for (const shipData of sheetShips) {
				// Manufacturer
				let manufacturer = await manufacturerRepo.findOne({ name: shipData.manufacturer })
				if (!manufacturer) {
					manufacturer = new Manufacturer(shipData.manufacturer)
					await this.db.em.persistAndFlush(manufacturer)
				}
				// Ship
				let ship = await shipRepo.findOne({ model: shipData.model })
				if (!ship) {
					ship = new Ship(manufacturer, shipData.model)
					await this.db.em.persistAndFlush(ship)
				}
				// Member
				let member = await memberRepo.findOne({ name: shipData.owner })
				if (!member) {
					member = new Member(shipData.owner)
					await this.db.em.persistAndFlush(member)
				}
				// MemberShip
				let memberShip = await memberShipRepo.findOne({ member, ship, name: shipData.name })
				if (!memberShip) {
					memberShip = new MemberShip(member, ship, shipData.name)
					await this.db.em.persistAndFlush(memberShip)
					conflicts.push({ type: 'add-db', ship: shipData })
				}
			}
			// (Opcional) Puedes agregar lógica para sincronizar de DB a Sheets si lo necesitas
			this.logger.log('Ship sync completed', 'info')
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : String(error)
			this.logger.log(`Error syncing ships: ${errMsg}`, 'error')
			conflicts.push({ type: 'error', error: errMsg })
		}

		return conflicts
	}

}
