import {
  Collection,
  Entity,
  EntityRepository,
  EntityRepositoryType,
  LoadStrategy,
  Loaded,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { CustomBaseEntity } from "./BaseEntity";
import { Ship } from "./Ship";

// ===========================================
// ================= Entity ==================
// ===========================================
@Entity({ customRepository: () => MemberRepository })
export class Member extends CustomBaseEntity {
  [EntityRepositoryType]?: MemberRepository;

  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property()
  name: string;

  @OneToMany({ entity: () => Ship, mappedBy: "owner" })
  ships = new Collection<Ship>(this);

  constructor(name: string) {
    super();
    this.name = name;
  }
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class MemberRepository extends EntityRepository<Member> {
  async findByName(name: string): Promise<Member | null> {
    return this.findOne({ name });
  }

  async findAutoComplete(name: string): Promise<Member[]> {
    return this.find({ name: { $like: name + "%" } }, { limit: 25 });
  }

  async getShips(manufacturer: string): Promise<Ship[]> {
    return this.findOneOrFail({ name: manufacturer }).then((manufacturer) =>
      manufacturer.ships.loadItems()
    );
  }
}
