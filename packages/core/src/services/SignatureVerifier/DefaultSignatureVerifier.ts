import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {ISignatureVerifier} from './ISignatureVerifier';

export class DefaultSignatureVerifier implements ISignatureVerifier {
	constructor(
		private ipfs: IPFSHTTPClient,
	) {
	}

	verify(post: CID, from: CID, sigs: { [p: string]: string }): Promise<boolean> {
		if (!sigs.hasOwnProperty(from.toString()))
			return Promise.resolve(false);

		return this.validateSignature(from, post, sigs[from.toString()])
	}

	validateSignature(key: CID, post: CID, sig: string) {
		return this.ipfs.dag.get(key)
			.then(r => {
				const key = new NodeRSA();
				key.importKey(r.value, 'pkcs8-public-der');

				return key.verify(post, Buffer.from(sig, 'base64'));
			});
	}
}
