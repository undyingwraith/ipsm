import {ISerializedPostContent} from './ISerializedPostContent';

export interface ISerializedPost {
	/**
	 * Identity of poster (public key)
	 */
	from:  string
	/**
	 * Signature of the content as a hex string
	 */
	sig: string
	/**
	 * Content of the post
	 */
	content: ISerializedPostContent[]
	/**
	 * Timestamp of post
	 */
	ts: number
}
