import {IPost, IpsmApp, PostManager} from '@undyingwraith/ipsm-core';
import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import * as NodeRSA from 'node-rsa';
import {IIpsmClientApp} from './IIpsmClientApp';
import {IStorageService, IValueStore, StorageService, SyncService} from './service';
import {IFilterService} from './service/FilterService/IFilterService';

class DefaultFilterService implements IFilterService {
	validatePost(post: CID, sigs: CID): Promise<boolean> {
		return Promise.resolve(false);
	}
}

export class IpsmClientApp extends IpsmApp implements IIpsmClientApp {
	private readonly storage: IStorageService;
	private readonly ipfsNode: IPFSHTTPClient;
	private sync: SyncService;

	/**
	 *
	 * @param ipfs
	 * @param identity
	 * @param storage
	 * @param filter
	 */
	constructor(ipfs: IPFSHTTPClient, identity: NodeRSA, storage: IValueStore, filter: IFilterService = new DefaultFilterService()) {
		super(ipfs, identity);
		this.ipfsNode = ipfs;
		this.storage = new StorageService(ipfs, storage);
		this.sync = new SyncService(ipfs, this.storage, new PostManager(ipfs, identity), filter);
	}

	/**
	 * @inheritDoc
	 */
	public override subscribeToBoard(board: string, action: (post: IPost) => void): Promise<void> {
		return this.sync.subscribe(board)
			.then(() => super.subscribeToBoard(board, action));
	}

	/**
	 * @inheritDoc
	 */
	public override unsubFromBoard(board: string): Promise<void> {
		return this.sync.unsubscribe(board)
			.then(() => super.unsubFromBoard(board));
	}

	/**
	 * Send a sync message
	 * @param board board the message belongs to
	 */
	async postSync(board: string): Promise<void> {
		return this.sync.postSync(board);
	}

	getPosts(board: string, skip = 0, take = 12) {
		return this.storage.getPosts(board, skip, take).catch(() => ([]));
	}

	addPost(board: string, post: IPost): Promise<void> {
		return this.storage.addPost(board, post);
	}

	async readFile(cid: CID): Promise<string> {
		return this.ipfsNode.dag.get(cid).then(r => new TextDecoder().decode(r.value))
	}

	getIpfs(): IPFSHTTPClient {
		return this.ipfsNode;
	}
}
