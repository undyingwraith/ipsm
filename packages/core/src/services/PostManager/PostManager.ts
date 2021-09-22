import {IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {IPost, IPostContent, ISerializedPost, ISerializedPostContent} from '../../types';
import {MimeHandlerRegistry} from '../mime';
import {IPostManager} from './IPostManager';

export class PostManager implements IPostManager {
	private handler: MimeHandlerRegistry;

	constructor(private ipfs: IPFSHTTPClient, private key: NodeRSA) {
		this.handler = MimeHandlerRegistry.build();
	}

	/**
	 * @inheritDoc
	 */
	public serialize(post: IPost): Promise<ISerializedPost> {
		return new Promise((resolve, reject) => {
			Promise.all(post.content.map(c => this.handler.write(c.data, c.mime).then(d => this.ipfs.add(d)).then(r => ({
				...c,
				data: r.cid.toString(),
			} as ISerializedPostContent))))
				.then(content => {
					const ts = Date.now();
					const unsignedPost = {
						...post,
						from: this.key.exportKey('public'),
						content,
						ts,
					};
					return {
						...unsignedPost,
						sig: this.key.sign(ts + JSON.stringify(unsignedPost.content)).toString('base64'),
					} as ISerializedPost;
				})
				.then(resolve)
				.catch(reject);
		});
	}

	/**
	 * @inheritDoc
	 */
	public deserialize(post: ISerializedPost): Promise<IPost> {
		return new Promise((resolve, reject) => {
			const key = new NodeRSA();
			key.importKey(post.from, 'public');
			if (key.verify(post.ts + JSON.stringify(post.content), Buffer.from(post.sig, 'base64'))) {
				resolve({
					from: post.from,
					content: post.content as IPostContent[],
					ts: post.ts,
					sig: post.sig,
				} as IPost);
			} else {
				reject('Invalid signature');
			}
		});
	}
}