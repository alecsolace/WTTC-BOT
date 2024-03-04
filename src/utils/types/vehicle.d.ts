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
