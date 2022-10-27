export interface IValueStore {
	set(key: string, value: string): void

	get(key: string): string
}
