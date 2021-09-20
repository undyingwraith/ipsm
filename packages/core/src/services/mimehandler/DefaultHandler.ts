import {IMimeHandler} from './IMimeHandler';

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
