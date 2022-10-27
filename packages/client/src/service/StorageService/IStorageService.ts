import {IPost} from '@undyingwraith/ipsm-core';
import {CID} from 'ipfs-http-client';

export type BoardContent = {[key: string]: any}

export interface IStorageService {
	/**
	 * Returns the root cid which contains all data
	 */
	get root(): CID;

	/**
	 * Returns a list of all boards
	 */
	getBoards(): Promise<string[]>;

	/**
	 * Add a new board to the list
	 * @param board identifier of the board
	 */
	addBoard(board: string): Promise<void>;

	/**
	 * Remove a board from the list
	 * @param board identifier of the board
	 */
	rmBoard(board: string): Promise<void>;

	/**
	 * Remove all boards
	 */
	clearBoards(): Promise<void>;

	getPosts(board: string, skip?: number, take?: number): Promise<IPost[]>;

	addPost(board: string, post: IPost, signatures: CID): Promise<void>;

	/**
	 * Returns all entries of a board
	 * @param board
	 */
	getBoard(board: string): BoardContent;

	setBoard(board: string, value: BoardContent): Promise<void>;
}
