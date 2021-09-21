import {IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {IIpsmApp} from './IIpsmApp';
import {IPostManager, IPostSerializer, ITopicService, PostManager, PostSerializer, TopicService} from './services';
import {IPost} from './types';

/**
 * Standard implementation of the IpsmApp
 */
export class IpsmApp implements IIpsmApp {
	private manager: IPostManager;
	private topics: ITopicService;
	private serializer: IPostSerializer;

	/**
	 * Initiate a new IpsmApp
	 * @param ipfs ipfs connection to connect to
	 * @param identity private key of the identity
	 */
	constructor(private ipfs: IPFSHTTPClient, private identity: NodeRSA) {
		this.manager = new PostManager(ipfs, identity);
		this.serializer = new PostSerializer();
		this.topics = new TopicService();
	}

	/**
	 * @inheritDoc
	 */
	subscribeToBoardFeed(action: (board: string) => void): Promise<void> {
		return this.ipfs.pubsub.subscribe(this.topics.getBoardDiscovery(), (msg) => {
			action(new TextDecoder().decode(msg.data));
		});
	}

	/**
	 * @inheritDoc
	 */
	subscribeToBoard(board: string, action: (post: IPost) => void): Promise<void> {
		return this.ipfs.pubsub.subscribe(this.topics.getBoard(board), (msg) => {
			const data = this.serializer.deserialize(msg.data);
			this.manager.deserialize(data)
				.then(action);
		});
	}

	/**
	 * @inheritDoc
	 */
	unsubFromBoard(board: string): Promise<void> {
		return this.ipfs.pubsub.unsubscribe(this.topics.getBoard(board));
	}

	/**
	 * @inheritDoc
	 */
	unsubFromBoardFeed(): Promise<void> {
		return this.ipfs.pubsub.unsubscribe(this.topics.getBoardDiscovery());
	}

	/**
	 * @inheritDoc
	 */
	postToBoard(board: string, post: IPost): Promise<void> {
		return this.manager.serialize(post)
			.then(this.serializer.serialize)
			.then((p) => this.ipfs.pubsub.publish(this.topics.getBoard(board), p));
	}

	/**
	 * @inheritDoc
	 */
	announce(board: string): Promise<void> {
		return this.ipfs.pubsub.publish(this.topics.getBoardDiscovery(), new TextEncoder().encode(board));
	}
}
