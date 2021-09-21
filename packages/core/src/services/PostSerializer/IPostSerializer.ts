import {ISerializedPost} from '../../types';

export interface IPostSerializer {
	/**
	 * Convert serialized post to binary
	 * @param post
	 */
	serialize(post: ISerializedPost): Uint8Array;

	/**
	 * Read serialized post from binary
	 * @param data
	 */
	deserialize(data: Uint8Array): ISerializedPost;
}
