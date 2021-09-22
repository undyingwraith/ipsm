import {IPost, IPostManager, IpsmApp, PostManager} from '@undyingwraith/ipsm-core';
import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {concat} from 'uint8arrays';
import {BoardStorageService} from './services/BoardStorageService';
import {SyncService} from './services/SyncService';

export class IpsmWebApp extends IpsmApp {
	private readonly board: BoardStorageService;
	private readonly ipfsNode: IPFSHTTPClient;
	private sync: SyncService;

	constructor(ipfs: IPFSHTTPClient, identity: NodeRSA, manager: IPostManager = new PostManager(ipfs, identity)) {
		super(ipfs, identity);
		this.ipfsNode = ipfs;
		this.board = new BoardStorageService(ipfs);
		this.sync = new SyncService(ipfs, this.board, manager);
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
		return this.board.getPosts(board, skip, take);
	}

	addPost(board: string, post: IPost): Promise<void> {
		return this.board.addPost(board, post);
	}

	async readFile(cid: CID): Promise<string> {
		const chunks = [];

		for await (const chunk of this.ipfsNode.cat(cid)) {
			chunks.push(chunk);
		}

		return new TextDecoder().decode(concat(chunks));
	};
}
