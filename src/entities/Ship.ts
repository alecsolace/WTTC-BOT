import {
  Collection,
  Entity,
  EntityRepository,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  EntityRepositoryType,
  OneToOne,
} from "@mikro-orm/core";
import { Member } from "./Member";
import { Manufacturer } from "./Manufacturer";
import { CustomBaseEntity } from "./BaseEntity";

// ===========================================
// ================= Entity ==================
// ===========================================
@Entity({ customRepository: () => ShipRepository })
export class Ship extends CustomBaseEntity {
  [EntityRepositoryType]?: ShipRepository;

  @PrimaryKey()
  id: number;

  @ManyToOne(() => Manufacturer)
  manufacturer: Manufacturer;

  @Property()
  model: string;

  @ManyToOne()
  owner: Member;

  @Property({ nullable: true })
  name?: string;

  constructor(
    manufacturer: Manufacturer,
    owner: Member,
    model: string,
    name?: string
  ) {
    super();
    this.manufacturer = manufacturer;
    this.model = model;
    this.name = name;
    this.owner = owner;
  }
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class ShipRepository extends EntityRepository<Ship> {
  async findByName(name: string): Promise<Ship | null> {
    return this.findOne({ name });
  }

  async findByModel(model: string): Promise<Ship | null> {
    return this.findOne({ model });
  }

  async findByOwner(owner: string): Promise<Ship[]> {
    return this.find({ owner: { name: owner } });
  }
}
