import {IPost} from '@undyingwraith/ipsm-core';
import {IPFSHTTPClient} from 'ipfs-http-client';
import {concat} from 'uint8arrays';

export class BoardStorageService {
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
		const chunks = [];

		for await (const chunk of this.ipfs.files.read(path)) {
			chunks.push(chunk);
		}

		return JSON.parse(new TextDecoder().decode(concat(chunks)));
	}

	public async addPost(board: string, post: IPost): Promise<void> {
		return this.ipfs.files.write(`/Applications/ipsm/${board}/${post.ts}_${post.from}`, JSON.stringify(post), {
			parents: true,
			create: true,
		});
	}

	getBoardFolder(board: string) {
		return `/Applications/ipsm/${board}`;
	}
}
