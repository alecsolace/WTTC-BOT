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
import { MemberShip } from './MemberShip'

// ===========================================
// ================= Entity ==================
// ===========================================
@Entity({ repository: () => MemberRepository })
export class Member extends CustomBaseEntity {

	[EntityRepositoryType]?: MemberRepository

	@PrimaryKey({ autoincrement: true })
  id: number

	@Property()
  name: string

	@OneToMany(() => MemberShip, memberShip => memberShip.member)
  memberShips = new Collection<MemberShip>(this)

	constructor(name: string) {
		super()
		this.name = name
	}

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class MemberRepository extends EntityRepository<Member> {

	async findByName(name: string): Promise<Member | null> {
		return this.findOne({ name })
	}

	async findAutoComplete(name: string): Promise<Member[]> {
		return this.find({ name: { $like: `${name}%` } }, { limit: 25, cache: 5000 })
	}

	async getShips(manufacturer: string) {
		return this.findOneOrFail({ name: manufacturer }).then(manufacturer =>
			manufacturer.memberShips.loadItems()
		)
	}

}
