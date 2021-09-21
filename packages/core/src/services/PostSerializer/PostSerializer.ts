import {ISerializedPost} from '../../types';
import {IPostSerializer} from './IPostSerializer';

export class PostSerializer implements IPostSerializer {
	/**
	 * @inheritDoc
	 */
	public serialize(post: ISerializedPost): Uint8Array {
		return new TextEncoder().encode(JSON.stringify(post));
	}

	/**
	 * @inheritDoc
	 */
	public deserialize(data: Uint8Array): ISerializedPost {
		return JSON.parse(new TextDecoder().decode(data));
	}
}
