import {CID} from 'ipfs-http-client';

export interface ISerializedPost {
	/**
	 * Identity of poster (public key)
	 */
	from: CID;
	/**
	 * Data of the post
	 */
	data: CID;
	/**
	 * Signature of the content as a hex string
	 */
	sigs: CID;
}
