import {IIpsmApp, IPost} from '@undyingwraith/ipsm-core/dist';
import {CID, IPFSHTTPClient} from 'ipfs-http-client';

export interface IIpsmClientApp extends IIpsmApp {
	postSync(board: string): Promise<void>;

	getPosts(board: string, skip?: number, take?: number): Promise<IPost[]>;

	addPost(board: string, post: IPost): Promise<void>;

	readFile(cid: CID): Promise<string>;

	getIpfs(): IPFSHTTPClient;
}
