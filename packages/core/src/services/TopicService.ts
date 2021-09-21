export class TopicService {
	getBoardFeed() {
		return '/ipsm/-';
	}

	getBoard(board: string) {
		return `/ipsm/${board}`;
	}

	getBoardSync(board: string) {
		return `/ipsm/-/${board}`;
	}
}
