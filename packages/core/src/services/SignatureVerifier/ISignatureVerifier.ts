import {CID} from 'ipfs-http-client';

export interface ISignatureVerifier {
	verify(post: CID, from: CID, sigs: {[key: string]: string}): Promise<boolean>
}
