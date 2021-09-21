import {IMimeHandler} from '../IMimeHandler';

/**
 * Mime handler for text
 */
export class TextHandler implements IMimeHandler {
	read(data: Uint8Array): Promise<string> {
		return Promise.resolve(new TextDecoder().decode(data));
	}

	write(data: string): Promise<Uint8Array> {
		return Promise.resolve(new TextEncoder().encode(data));
	}

	canHandle(mime: string): boolean {
		return mime.startsWith('text/')
	}
}
