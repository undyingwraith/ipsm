import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {IPost, ISerializedPost} from '../../types';
import {DefaultSignatureVerifier, ISignatureVerifier} from '../SignatureVerifier';
import {IPostManager} from './IPostManager';

export class PostManager implements IPostManager {

	constructor(
		private ipfs: IPFSHTTPClient,
		private key: NodeRSA,
		private verifier: ISignatureVerifier = new DefaultSignatureVerifier(ipfs),
	) {
	}

	/**
	 * @inheritDoc
	 */
	public serialize(post: IPost): Promise<ISerializedPost> {
		let key: CID;
		let postCid: CID;
		return this.ipfs.dag.put(this.key.exportKey('pkcs8-public-der'), { format: 'dag-cbor', hashAlg: 'sha2-256' })
			.then(k => {
				key = k;

				const ts = Date.now();

				return this.ipfs.dag.put({
					...post,
					from: key,
					ts,
				}, { format: 'dag-cbor', hashAlg: 'sha2-256' });
			})
			.then(post => {
				postCid = post;

				return this.ipfs.dag.put({
					[key.toString()]: this.key.sign(post).toString('base64'),
				});
			})
			.then(sigs => {
				return {
					from: key,
					data: postCid,
					sigs: sigs,
				} as ISerializedPost;
			});
	}

	/**
	 * @inheritDoc
	 */
	public deserialize(post: ISerializedPost): Promise<IPost> {
		return this.ipfs.dag.get(post.sigs)
			.then(sigs => this.verifier.verify(post.data, post.from, sigs.value))
			.then(valid => valid
				? this.ipfs.dag.get(post.data).then(res => res.value)
				: Promise.reject('signature not verified'),
			);
	}
}
