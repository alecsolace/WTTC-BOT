import {
	Entity,
	EntityRepository,
	EntityRepositoryType,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core'

import { Member, Ship } from '@/entities'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => MemberShipRepository })
export class MemberShip {

	[EntityRepositoryType]?: MemberShipRepository
	@PrimaryKey()
  id!: number

	@ManyToOne(() => Member)
  member!: Member

	@ManyToOne(() => Ship)
  ship!: Ship

	@Property()
  name?: string

	constructor(member: Member, ship: Ship, name?: string) {
		this.member = member
		this.ship = ship
		this.name = name
	}

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class MemberShipRepository extends EntityRepository<MemberShip> {

	async findByMember(memberId: number) {
		return this.find(
			{ member: { id: memberId } },
			{ populate: ['ship', 'member'] }
		)
	}

}
