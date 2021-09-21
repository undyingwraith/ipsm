import {IPost, ISerializedPost} from '../../types';

export interface IPostManager {
	serialize(post: IPost): Promise<ISerializedPost>;

	deserialize(post: ISerializedPost): Promise<IPost>;
}
