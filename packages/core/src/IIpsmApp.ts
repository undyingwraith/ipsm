import {IPost} from './types';

export interface IIpsmApp {
	/**
	 * Subscribe to the BoardService discovery feed
	 * @param action callback on receive of a new BoardService
	 */
	subscribeToBoardFeed(action: (board: string) => void): Promise<void>;

	/**
	 * Unsubscribe from the BoardService discovery feed
	 */
	unsubFromBoardFeed(): Promise<void>;

	/**
	 * Subscribe to BoardService posts
	 * @param board BoardService to subscribe to
	 * @param action callback on receive of a new post
	 */
	subscribeToBoard(board: string, action: (post: IPost) => void): Promise<void>;

	/**
	 * Unsubscribe from a BoardService
	 * @param board BoardService to unsubscribe from
	 */
	unsubFromBoard(board: string): Promise<void>;

	/**
	 * Add a new post to a BoardService
	 * @param board BoardService to post to
	 * @param post post to add to the BoardService
	 */
	postToBoard(board: string, post: IPost): Promise<void>;

	/**
	 * Announce a BoardService on the discovery channel
	 * @param board BoardService name
	 */
	announce(board: string): Promise<void>;
}
