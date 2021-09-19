import {DefaultHandler} from './DefaultHandler';
import {IMimeHandler} from './IMimeHandler';
import {TextHandler} from './TextHandler';

export class MimeHandlerRegistry {
	private handlers: IMimeHandler[] = [];

	register(handler: IMimeHandler) {
		this.handlers.push(handler);
	}

	read(data: Uint8Array, mime: string) {
		return this.findHandler(mime)?.read(data);
	}

	write(data: any, mime: string) {
		return this.findHandler(mime)?.write(data);
	}

	private findHandler(mime: string) {
		const handler = this.handlers.find(h => h.canHandle(mime));
		return handler ?? new DefaultHandler()
	}
}

export const setUpMimeHandler = () => {
	const h = new MimeHandlerRegistry();
	h.register(new TextHandler());

	return h;
};
