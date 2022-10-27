import {IPost} from '@undyingwraith/ipsm-core';
import {CID, IPFSHTTPClient} from 'ipfs-http-client';
import {IValueStore} from '../ValueStore';
import {BoardContent, IStorageService} from './IStorageService';

export class StorageService implements IStorageService {
	/**
	 *
	 * @param ipfs
	 * @param store
	 */
	constructor(private ipfs: IPFSHTTPClient, private store: IValueStore) {
		const cid = CID.parse(store.get('ipsm_root'));
		if (cid) {
			this._root = cid;
		} else {
			void this.init();
		}
	}

	/**
	 * @inheritDoc
	 */
	public async getBoards(): Promise<string[]> {
		return (await this.ipfs.dag.get(this.root)).value.keys();
	}

	/**
	 * @inheritDoc
	 */
	public addBoard(board: string): Promise<void> {
		return this.ipfs.dag.put({})
			.then(cid => cid.toV1())
			.then(cid => new Promise((resolve, reject) => {
				this.ipfs.dag.get(this.root)
					.then(r => {
						resolve([cid, r.value]);
					})
					.catch(reject);
			}) as Promise<[CID, { [key: string]: CID }]>)
			.then(([cid, boards]) => {
				// Board already exists -> skip
				if (boards.hasOwnProperty(board)) return;

				boards[board] = cid;
				return this.ipfs.dag.put(boards);
			})
			.then(cid => {
				if (cid) this.root = cid;
			});
	}

	/**
	 * @inheritDoc
	 */
	clearBoards() {
		return this.init();
	}

	/**
	 * @inheritDoc
	 */
	rmBoard(board: string): Promise<void> {
		return this.ipfs.dag.get(this.root)
			.then(r => {
				const boards = r.value as { [key: string]: CID };
				delete boards[board];
				return this.ipfs.dag.put(boards);
			})
			.then(cid => {
				this.root = cid;
			});
	}

	getBoard(board: string): BoardContent {
		return this.ipfs.dag.get(this.root)
			.then(res => this.ipfs.dag.get(res.value[board]))
			.then(res => res.value);
	}

	setBoard(board: string, value: BoardContent): Promise<void> {
		return this.ipfs.dag.put(value)
			.then(cid => {
				return this.ipfs.dag.get(this.root).then(r => [cid, r] as [CID, any]);
			})
			.then(([cid, r]) => {
				const value = r.value as BoardContent;
				value[board] = cid;
				return this.ipfs.dag.put(value);
			})
			.then(cid => {
				this.root = cid;
			});
	}

	public async getPosts(board: string, skip = 0, take = 12): Promise<IPost[]> {
		try {
			const controller = new AbortController();
			const files: string[] = [];
			for await (const file of this.ipfs.files.ls(`/Applications/ipsm/${board}`, {
				signal: controller.signal,
			})) {
				files.push(file.name);
			}

			return Promise.all(files
				.sort((a, b) => b.localeCompare(a))
				.slice(skip, skip + take)
				.map(async f => await this.loadPost(`/Applications/ipsm/${board}/${f}`)),
			);
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	private async loadPost(path: string): Promise<IPost> {
		return this.ipfs.files.stat(path)
			.then(stat => this.ipfs.dag.get(stat.cid))
			.then(r => r.value);
	}

	public async addPost(board: string, post: IPost, signatures: CID): Promise<void> {
		//TODO: save with signatures etc
		let postCid: CID;
		return this.ipfs.dag.put(post)
			.then((cid) => {
				postCid = cid;
				return this.updateBoard(board, post, postCid);
			})
			.then(cid => {
				this.root = cid;
			});
	}

	private updateBoard(board: string, post: IPost, postCid: CID): Promise<CID> {
		return this.ipfs.dag.get(this.root)
			.then(r => {
				let newVal = r.value;
				if (!newVal[board]) {
					newVal[board] = [];
				}
				newVal[board][`${post.ts}_${post.from}`] = postCid;
				return this.ipfs.dag.put(newVal);
			});
	}

	get root(): CID {
		return this._root;
	}

	set root(root: CID) {
		this._root = root;
		this.store.set('ipsm_root', root.toV1().toString());
	}

	private init(): Promise<void> {
		return this.initEmpty().then(cid => {
			this.root = cid;
		});
	}

	private initEmpty(): Promise<CID> {
		return this.ipfs.dag.put({}).then(cid => cid.toV1());
	}

	private _root: any;
}
