import {IPFSHTTPClient} from 'ipfs-http-client';
import {PostManager, PostSerializer} from './services';
import {TopicService} from './services/TopicService';
import {IPost} from './types';
import NodeRSA from 'node-rsa';

export class IpsmApp {
	private manager: PostManager;
	private topics: TopicService;

	constructor(private ipfs: IPFSHTTPClient, private identity: NodeRSA) {
		this.manager = new PostManager(ipfs, identity);
		this.topics = new TopicService();
	}

	subscribeToBoardFeed(action: (board: string) => void): Promise<void> {
		return this.ipfs.pubsub.subscribe(this.topics.getBoardFeed(), (msg) => {
			action(new TextDecoder().decode(msg.data));
		});
	}

	subscribeToBoard(board: string, action: (post: IPost) => void): Promise<void> {
		return this.ipfs.pubsub.subscribe(this.topics.getBoard(board), (msg) => {
			const data = PostSerializer.deserialize(msg.data);
			this.manager.deserialize(data)
				.then(action);
		});
	}

	unsubFromBoard(board: string): Promise<void> {
		return this.ipfs.pubsub.unsubscribe(this.topics.getBoard(board));
	}

	unsubFromBoardFeed(): Promise<void> {
		return this.ipfs.pubsub.unsubscribe(this.topics.getBoardFeed());
	}

	postToBoard(board: string, post: IPost): Promise<void> {
		return this.manager.serialize(post)
			.then(PostSerializer.serialize)
			.then((p) => this.ipfs.pubsub.publish(`/ipsm/${board}`, p));
	}
}
