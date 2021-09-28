import {CID} from 'ipfs-http-client';

export interface IPostContent {
	/**
	 * Mime of the content (Ex: text/plain)
	 */
	mime: string
	data: CID
} 
