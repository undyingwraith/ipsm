import {IMimeHandler} from '../IMimeHandler';

/**
 * Default mime handler that doesnt do anything
 */
export class DefaultHandler implements IMimeHandler {
	canHandle(mime: string): boolean {
		return false;
	}

	read(data: Uint8Array): Promise<any> {
		return Promise.resolve(undefined);
	}

	write(data: any): Promise<Uint8Array> {
		return Promise.resolve(Buffer.from(data));
	}

}
