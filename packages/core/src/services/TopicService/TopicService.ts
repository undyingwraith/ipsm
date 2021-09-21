import {ITopicService} from './ITopicService';

export class TopicService implements ITopicService {
	/**
	 * @inheritDoc
	 */
	getBoardDiscovery(): string {
		return '/ipsm/-';
	}

	/**
	 * @inheritDoc
	 */
	getBoard(board: string): string {
		return `/ipsm/${board}`;
	}

	/**
	 * @inheritDoc
	 */
	getBoardSync(board: string): string {
		return `/ipsm/-/${board}`;
	}
}
