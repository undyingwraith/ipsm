import {DefaultHandler, TextHandler} from './handlers';
import {IMimeHandler} from './IMimeHandler';
import {IMimeHandlerRegistry} from './IMimeHandlerRegistry';


export class MimeHandlerRegistry implements IMimeHandlerRegistry {
	private handlers: IMimeHandler[] = [];

	/**
	 * @inheritDoc
	 */
	register(handler: IMimeHandler) {
		this.handlers.push(handler);
	}

	/**
	 * @inheritDoc
	 */
	read(data: Uint8Array, mime: string) {
		return this.findHandler(mime)?.read(data);
	}

	/**
	 * @inheritDoc
	 */
	write(data: any, mime: string) {
		return this.findHandler(mime)?.write(data);
	}

	private findHandler(mime: string) {
		const handler = this.handlers.find(h => h.canHandle(mime));
		return handler ?? new DefaultHandler();
	}

	public static build() {
		const h = new MimeHandlerRegistry();
		h.register(new TextHandler());

		return h;
	}
}
