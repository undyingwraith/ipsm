import {IPostContent} from './IPostContent';

export interface IPost {
	/**
	 * Identity of poster (public key)
	 */
	from?:  string
	/**
	 * Content of the post
	 */
	content: IPostContent[]
	/**
	 * Timestamp of post
	 */
	ts?: number

	sig?: string
}