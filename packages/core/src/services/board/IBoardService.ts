import {IPost} from '../../types';

export interface IBoardService {
	// TODO
	// getBoards() : string[]
	// TODO
	// addBoard(board: string): void
	/**
	 * Loads specified range of posts from a board
	 * @param board board to load
	 * @param skip post to skip
	 * @param take how many posts to load
	 */
	getPosts(board: string, skip?: number, take?: number): Promise<IPost[]>;

	/**
	 * Add a post to specified board
	 * @param board board to add the post to
	 * @param post post to add
	 */
	addPost(board: string, post: IPost): Promise<void>
}
