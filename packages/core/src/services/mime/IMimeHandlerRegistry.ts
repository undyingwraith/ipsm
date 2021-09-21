import {IMimeHandler} from './IMimeHandler';

export interface IMimeHandlerRegistry {
	/**
	 * Register a new mime handler
	 * @param handler handler to register
	 */
	register(handler: IMimeHandler): void

	/**
	 * Read data
	 * @param data data to read
	 * @param mime mime type to use when parsing
	 */
	read<T>(data: Uint8Array, mime: string): Promise<T>

	/**
	 * Write data
	 * @param data data to write
	 * @param mime mime type to use when encoding
	 */
	write(data: any, mime: string): Promise<Uint8Array>
}
