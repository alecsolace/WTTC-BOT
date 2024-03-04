import {
	Collection,
	Entity,
	EntityRepository,
	EntityRepositoryType,
	Loaded,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core'

import { CustomBaseEntity } from './BaseEntity'
import { Manufacturer } from './Manufacturer'
import { Member } from './Member'
import { MemberShip } from './MemberShip'

// ===========================================
// ================= Entity ==================
// ===========================================
@Entity({ customRepository: () => ShipRepository })
export class Ship extends CustomBaseEntity {

	[EntityRepositoryType]?: ShipRepository

	@PrimaryKey()
  id: number

	@ManyToOne(() => Manufacturer)
  manufacturer: Manufacturer

	@Property()
  model: string

	@OneToMany(() => MemberShip, memberShip => memberShip.ship)
  memberShips = new Collection<MemberShip>(this)

	constructor(manufacturer: Manufacturer, model: string) {
		super()
		this.manufacturer = manufacturer
		this.model = model
	}

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class ShipRepository extends EntityRepository<Ship> {

	async findByModel(model: string): Promise<Ship | null> {
		return this.findOne({ model })
	}

	async findByMember(ownerId: number) {
		return this.find(
			{ memberShips: { member: { id: ownerId } } },
			{
				populate: ['manufacturer', 'memberShips', 'memberShips.member'],
				orderBy: { model: 'DESC' },
				populateWhere: { memberShips: { member: { id: ownerId } } },
			}
		)
	}

	async findAutoCompleteWManufacturer(model: string, manufacturer: string) {
		return await this.find({ model: { $like: `%${model}%` }, manufacturer: { name: manufacturer } }, { limit: 25, orderBy: { model: 'ASC' } })
	}

}
