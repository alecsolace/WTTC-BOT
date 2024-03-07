export type Search = {
	pages: Page[]
}

export type Page = {
	id: number
	key?: string
	title?: string
	excerpt?: string
	description?: string
	thumbnail?: Thumbnail
}

type Thumbnail = {
	mimetype: string
	size?: any
	width: number
	height: number
	duration?: any
	url: string
}

export type Vehicle = {
	manufacturer: string
	manufacturerId: string
	name?: string
	description?: string
	role?: string
	crew?: string
	cargo?: number
	length?: number
	height?: number
	beam?: number
	mass?: number
	combatSpeed?: number
	afterBurner?: number
	maxSpeed?: number
	pitch?: number
	yaw?: number
	roll?: number
	acceleration: {
		main?: number
		retro?: number
		vtol?: number
	}
	ingamePrice?: number
	pledgePrice?: number
	status?: string
	imageUrl?: string
}

export type RootObject = {
	data: Data
	meta: Meta
}

export type Data = {
	agility?: Agility
	cargo_capacity?: number
	chassis_id?: number
	crew?: Crew
	description?: Description
	foci?: Description[]
	fuel?: Fuel
	health?: number
	id?: number
	insurance?: Insurance
	manufacturer: Manufacturer
	mass?: any
	missing_translations?: any[]
	msrp?: number
	name?: string
	personal_inventory_capacity?: number
	production_note?: Description
	production_status?: Description
	quantum?: Quantum
	size?: Description
	sizes?: Sizes
	slug?: string
	speed?: Speed
	type?: Description
	updated_at?: Date
	uuid?: any
}

export type Agility = {
	acceleration?: Acceleration
	pitch?: any
	roll?: any
	yaw?: any
}

export type Acceleration = {
	main?: number
	retro?: number
	vtol?: number
}

export type Crew = {
	max?: number
	min?: number
	operation?: number
	weapon?: number
}

export type Description = {
	de_DE?: string
	en_EN?: string
}

export type Fuel = {
	capacity?: number
	intake_rate?: number
	usage?: Usage
}

export type Usage = {
	main?: number
	maneuvering?: number
	retro?: number
	vtol?: number
}

export type Insurance = {
	claim_time?: number
	expedite_cost?: number
	expedite_time?: number
}

export type Manufacturer = {
	code: string
	name: string
}

export type Quantum = {
	quantum_fuel_capacity?: number
	quantum_range?: number
	quantum_speed?: number
	quantum_spool_time?: number
}

export type Sizes = {
	beam?: number
	height?: number
	length?: number
}

export type Speed = {
	afterburner?: any
	max?: number
	max_to_zero?: number
	scm?: any
	scm_to_zero?: number
	zero_to_max?: number
	zero_to_scm?: number
}

export type Meta = {
	processed_at?: Date
	valid_relations?: string[]
}
