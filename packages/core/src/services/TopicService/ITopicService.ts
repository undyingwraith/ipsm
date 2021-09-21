export interface ITopicService {
	/**
	 * returns the PubSub topic of the discovery
	 */
	getBoardDiscovery(): string;

	/**
	 * returns the PubSub topic of the specified BoardService
	 * @param board BoardService to get the topic of
	 */
	getBoard(board: string): string;

	/**
	 * returns the PubSub sync topic of the specified BoardService
	 * @param board BoardService to get the topic of
	 */
	getBoardSync(board: string): string;
}
