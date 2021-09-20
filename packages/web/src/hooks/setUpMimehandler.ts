import {MimeHandlerRegistry, TextHandler} from '@undyingwraith/ipsm-core';


export const setUpMimeHandler = () => {
	const h = new MimeHandlerRegistry();
	h.register(new TextHandler());

	return h;
};
