import {CID} from 'ipfs-http-client';
import {ISerializedPost} from '../../types';
import {IPostSerializer} from './IPostSerializer';

export class PostSerializer implements IPostSerializer {
	/**
	 * @inheritDoc
	 */
	public serialize(post: ISerializedPost): Uint8Array {
		return new TextEncoder().encode(JSON.stringify({
			from: post.from.toString(),
			data: post.data.toString(),
			sigs: post.sigs.toString(),
		}));
	}

	/**
	 * @inheritDoc
	 */
	public deserialize(data: Uint8Array): ISerializedPost {
		const post = JSON.parse(new TextDecoder().decode(data))
		return {
			from: CID.parse(post.from),
			data: CID.parse(post.data),
			sigs: CID.parse(post.sigs),
		};
	}
}
