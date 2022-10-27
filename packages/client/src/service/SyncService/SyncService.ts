import Denque from 'denque';
import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import {concat} from 'uint8arrays';
import {IFilterService} from '../FilterService/IFilterService';
import {IStorageService} from '../StorageService';

type QueueItem = {
	/**
	 * received root CID
	 */
	cid: CID;
	/**
	 * Board identifier
	 */
	board: string;
}

export class SyncService {
	private isSyncing: boolean = false;
	private queue = new Denque<QueueItem>();

	constructor(
		private ipfs: IPFSHTTPClient,
		private storage: IStorageService,
		private filter: IFilterService,
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
		return this.ipfs.pubsub.publish(`/ipsm/-/${board}`, new TextEncoder().encode(this.storage.getBoard(board).toV1().toString()));
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
		try {
			do {
				const item = this.queue.shift();
				if (item) {
					await this.handleItem(item);
				}
			} while (this.queue.peekFront());
		} finally {
			this.isSyncing = false;
		}
	}

	/**
	 * Process a received CID
	 * @param item
	 * @private
	 */
	private async handleItem(item: QueueItem) {
		// Same root CID -> skip
		if (item.cid.toString() == this.storage.getBoard(item.board).toString()) return;

		//TODO: pick more precise type, but i haven't found the ipfs packages that exposes it yet
		let newPosts: { [key: string]: CID };

		return this.ipfs.dag.get(item.cid)
			.then(p => {
				newPosts = p.value;

				return this.storage.getBoard(item.board);
			})
			.then(async (p) => {
				const existing = p.value as { [key: string]: CID };

				// Syncing
				for (const id in newPosts) {
					if (existing.hasOwnProperty(id)) continue;

					if (await this.filter.validatePost(newPosts[id])) {
						existing[id] = newPosts[id];
					}
				}

				return this.storage.setBoard(item.board, existing);
			});


		for await (const file of this.ipfs.ls(item.cid)) {
			if (file.name in existing) continue;

			try {
				const data = JSON.parse(await this.readFile(file.cid));
				const post = await this.manager.deserialize(data);

				await this.storage.addPost(item.board, post);
			} catch (e) {
				//ignored we dont care
			}
		}
	}

	private async readFile(cid: CID): Promise<string> {
		const chunks = [];

		for await (const chunk of this.ipfs.cat(cid)) {
			chunks.push(chunk);
		}

		return new TextDecoder().decode(concat(chunks));
	};
}
