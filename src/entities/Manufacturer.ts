import {
	Collection,
	Entity,
	EntityRepository,
	EntityRepositoryType,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core'

import { CustomBaseEntity } from './BaseEntity'
import { Ship } from './Ship'

// ===========================================
// ================= Entity ==================
// ===========================================
@Entity({ repository: () => ManufacturerRepository })
export class Manufacturer extends CustomBaseEntity {

	[EntityRepositoryType]?: ManufacturerRepository

	@PrimaryKey()
    id: number

	@Property()
    name: string

	@OneToMany(() => Ship, ship => ship.manufacturer)
    ships = new Collection<Ship>(this)

	constructor(name: string) {
		super()
		this.name = name
	}

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class ManufacturerRepository extends EntityRepository<Manufacturer> {

	async findByName(name: string): Promise<Manufacturer | null> {
		return this.findOne({ name })
	}

	async findAutoComplete(name: string): Promise<Manufacturer[]> {
		return await this.find({ name: { $like: `%${name}%` } }, { limit: 25, orderBy: { name: 'ASC' }, cache: 5000 })
	}

	async getShips(manufacturer: string): Promise<Ship[]> {
		return this.findOneOrFail({ name: manufacturer }).then(manufacturer => manufacturer.ships.loadItems())
	}

}
