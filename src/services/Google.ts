import * as process from 'node:process'

import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import { Schedule, Service } from '@/decorators'
import { Manufacturer, Member, MemberShip, Ship } from '@/entities'
import { Database, Logger } from '@/services'

type ShipRow = {
	'Manufacturer': string
	'Model': string
	'Owner': string
	'Ship name'?: string
}
type MemberRow = { MEMBER: string }
type ManufacturerRow = { Manufacturer: string }

@Service()
export class Google {

	private serviceAccountJWT = new JWT({
		email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		key: process.env.GOOGLE_PRIVATE_KEY,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	})

	private doc = new GoogleSpreadsheet(
		process.env.SPREADSHEET_ID as string,
		this.serviceAccountJWT
	)

	constructor(private logger: Logger, private db: Database) {
		this.logger.console('Service Google invoked !', 'info')
	}

	async accessSpreadsheet() {
		await this.doc.loadInfo()
	}

	async migrateMembers() {
		const members = await this.getMembers()
		const memberRepository = this.db.get(Member)
		this.logger.log('Migrating members', 'info')
		for (const memberName of members) {
			await this.persistMember(memberName, memberRepository)
		}
	}

	async persistMember(memberName: string, memberRepository: any) {
		let member = await memberRepository.findOne({ name: memberName })
		if (!member) {
			member = new Member(memberName)
			await memberRepository.persistAndFlush(member)
			this.logger.log(`Member ${memberName} added`, 'info')
		}
	}

	async migrateManufacturers() {
		const manufacturers = await this.getManufacturers()
		const manufacturerRepository = this.db.get(Manufacturer)
		this.logger.log('Migrating manufacturers', 'info')
		for (const manufacturerData of manufacturers) {
			await this.persistManufacturer(manufacturerData, manufacturerRepository)
		}
	}

	async persistManufacturer(
		manufacturerData: string,
		manufacturerRepository: any
	) {
		let manufacturer = await manufacturerRepository.findOne({
			name: manufacturerData,
		})
		if (!manufacturer) {
			manufacturer = new Manufacturer(manufacturerData)
			await manufacturerRepository.persistAndFlush(manufacturer)
			this.logger.log(`Manufacturer ${manufacturerData} added`, 'info')
		}
	}

	async migrateShips() {
		const ships = await this.getMemberShips()
		this.logger.log('Migrating ships', 'info')
		for (const shipData of ships) {
			await this.persistShip(shipData)
		}
		for (const shipData of ships) {
			await this.persistMemberShip(shipData)
		}
	}

	async persistShip(shipData: any) {
		let ship: Ship | null = await this.db.get(Ship).findOne({
			model: shipData.model,
		})
		const manufacturer = await this.db
			.get(Manufacturer)
			.findByName(shipData.manufacturer)
		if (!manufacturer) {
			this.logger.log(
        `Manufacturer ${shipData.manufacturer} not found`,
        'info'
			)

			return
		}
		if (!ship) {
			// Create new ship
			ship = new Ship(manufacturer, shipData.model)
			await this.db.em.persistAndFlush(ship)
			this.logger.log(`Ship ${shipData.model} added`, 'info')
		}
	}

	async persistMemberShip(shipData: any) {
		const ship = await this.db.get(Ship).findOne({ model: shipData.model })
		const owner = await this.db.get(Member).findByName(shipData.owner)
		if (!ship) {
			this.logger.log(`Ship ${shipData.model} not found`, 'info')

			return
		}
		if (!owner) {
			this.logger.log(`Owner ${shipData.owner} not found`, 'info')

			return
		}

		// Check if the member already owns this ship
		let memberShip = await this.db
			.get(MemberShip)
			.findOne({ member: owner, ship, name: shipData.name })

		if (!memberShip) {
			// If the member does not own this ship, create a new MemberShip
			memberShip = new MemberShip(owner, ship, shipData.name)
			await this.db.em.persistAndFlush(memberShip)
			this.logger.log(
        `Ship ${shipData.model} added to member ${shipData.owner}`,
        'info'
			)
		}
	}

	@Schedule('0 0 * * 1', 'Migrate from Spreadsheet')
	async migrate() {
		await this.migrateMembers()
		await this.migrateManufacturers()
		await this.migrateShips()
	}

	private async getMemberShips() {
		await this.accessSpreadsheet()
		const sheet = this.doc.sheetsByIndex[0]
		await sheet.loadHeaderRow(4)
		const rows = await sheet.getRows<ShipRow>()

		const ships: {
			manufacturer: string
			model: string
			owner: string
			name?: string
		}[] = []
		rows.forEach((row) => {
			const ship: {
				manufacturer: string
				model: string
				owner: string
				name?: string
			} = {
				manufacturer: row.get('Manufacturer'),
				model: row.get('Model'),
				owner: row.get('Owner'),
				name: row.get('Ship name'),
			}
			ships.push(ship)
		})

		return ships
	}

	private async getMembers() {
		await this.accessSpreadsheet()
		const sheet = this.doc.sheetsByIndex[3]
		await sheet.loadHeaderRow(3)
		const rows = await sheet.getRows<MemberRow>()

		const members: string[] = []
		rows.forEach((row) => {
			if (row.get('MEMBER') !== '') {
				const member = row.get('MEMBER') as string
				members.push(member)
			}
		})

		return members
	}

	private async getManufacturers(): Promise<string[]> {
		await this.accessSpreadsheet()
		const sheet = this.doc.sheetsByIndex[2]
		await sheet.loadHeaderRow(3)
		const rows = await sheet.getRows<ManufacturerRow>()

		const ships: string[] = []
		rows.forEach((row) => {
			if (row.get('Manufacturer') != null) {
				ships.push(row.get('Manufacturer') as string)
			}
		})

		// return only unique values
		return [...new Set(ships)]
	}

}
