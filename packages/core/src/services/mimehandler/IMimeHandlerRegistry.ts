import {IMimeHandler} from './IMimeHandler';

export interface IMimeHandlerRegistry {
	register(handler: IMimeHandler): void

	read<T>(data: Uint8Array, mime: string): Promise<T>

	write(data: any, mime: string): Promise<Uint8Array>
}
