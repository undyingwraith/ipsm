import {IBoardService, IPost} from '@undyingwraith/ipsm-core';
import {sha1} from 'crypto-hash';
import {IPFSHTTPClient} from 'ipfs-http-client';
import {concat} from 'uint8arrays';

export class BoardStorageService implements IBoardService {
	constructor(private ipfs: IPFSHTTPClient) {
	}

	public static getBoards(): string[] {
		const stored = localStorage.getItem('boards');

		return stored ? JSON.parse(stored) : [];
	}

	public static addBoard(board: string) {
		localStorage.setItem('boards', JSON.stringify([...BoardStorageService.getBoards().filter(s => s !== board), board].sort()));
	}

	public async getPosts(board: string, skip = 0, take = 12) {
		let posts: IPost[] = [];
		let i = 0;
		try {
			const controller = new AbortController();
			for await (const file of this.ipfs.files.ls(`/Applications/ipsm/${board}`, {
				signal: controller.signal,
			})) {
				i++;
				if (i < skip) {
					continue;
				}
				if (i >= skip + take) {
					controller.abort();
					break;
				}

				const post = await this.loadPost(`/Applications/ipsm/${board}/${file.name}`);
				posts.push(post);
			}
		} catch (e) {
			console.error(e);
			return [];
		}
		return posts;
	}

	private async loadPost(path: string): Promise<IPost> {
		const chunks = [];

		for await (const chunk of this.ipfs.files.read(path)) {
			chunks.push(chunk);
		}

		return JSON.parse(new TextDecoder().decode(concat(chunks)));
	}

	public async addPost(board: string, post: IPost): Promise<void> {
		const id = await sha1(post.from!);
		return this.ipfs.files.write(`/Applications/ipsm/${board}/${post.ts}_${id}`, JSON.stringify(post), {
			parents: true,
			create: true,
		});
	}
}
