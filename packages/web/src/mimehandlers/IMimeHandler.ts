export interface IMimeHandler {
	read(data: Uint8Array): Promise<any>

	write(data: any): Promise<Uint8Array>

	canHandle(mime: string): boolean
}
