import {CID} from 'ipfs-http-client';

export interface IFilterService {
	validatePost(post: CID, sigs: CID): Promise<boolean>
}
