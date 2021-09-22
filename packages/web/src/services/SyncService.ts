import {IPostManager} from '@undyingwraith/ipsm-core';
import Denque from 'denque';
import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import {concat} from 'uint8arrays';
import {BoardStorageService} from './BoardStorageService';

export class SyncService {
	private isSyncing: boolean = false;
	private queue = new Denque();

	constructor(
		private ipfs: IPFSHTTPClient,
		private board: BoardStorageService,
		private manager: IPostManager,
	) {
	}

	public subscribe(board: string) {
		return this.ipfs.pubsub.subscribe(`/ipsm/-/${board}`, msg => {
			const cid = CID.parse(new TextDecoder().decode(msg.data));
			cid && this.onSync(board, cid);
		});
	}

	public unsubscribe(board: string) {
		return this.ipfs.pubsub.unsubscribe(`/ipsm/-/${board}`);
	}

	public async postSync(board: string): Promise<void> {
		try {
			const stat = await this.ipfs.files.stat(this.board.getBoardFolder(board));
			return this.ipfs.pubsub.publish(`/ipsm/-/${board}`, new TextEncoder().encode(stat.cid.toString()));
		} catch (e) {
			console.error(e);
			return Promise.resolve();
		}
	}

	private onSync(board: string, cid: CID) {
		this.queue.push({
			board,
			cid,
		});
		void this.workQueue();
	}

	private async workQueue() {
		if (this.isSyncing || !this.queue.peekFront()) return;

		this.isSyncing = true;
		do {
			const item = this.queue.shift();
			const existing: any[] = [];
			const sync: any[] = [];

			try {
				for await (const file of this.ipfs.files.ls(this.board.getBoardFolder(item.board))) {
					existing.push(file);
				}
			} catch(e) {
				// folder doesnt exist yet
			}

			for await (const file of this.ipfs.ls(item.cid)) {
				sync.push(file);
			}

			const toSync = sync.filter(s => existing.findIndex(e => e.name === s.name));

			for (let item of toSync) {
				const data = JSON.parse(await this.readFile(item.cid));
				const post = await this.manager.deserialize(data);
				await this.board.addPost(item.board, post);
			}
		} while (this.queue.peekFront());
		this.isSyncing = false;
	}

	private async readFile(cid: CID): Promise<string> {
		const chunks = [];

		for await (const chunk of this.ipfs.cat(cid)) {
			chunks.push(chunk);
		}

		return new TextDecoder().decode(concat(chunks));
	};
}
