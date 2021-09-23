import fs from 'fs';
import {create} from 'ipfs-http-client';
import cron from 'node-cron';
import NodeRSA from 'node-rsa';
import {IpsmRelayApp} from './IpsmRelayApp';

const ipfs = create();
const ipsm = new IpsmRelayApp(ipfs, new NodeRSA({b: 512}));

const CONFIG_FILE = './relay.config.json'

let config = {
	boards: [
		'ipsm'
	]
}

if (fs.existsSync(CONFIG_FILE)) {
	const data = fs.readFileSync(CONFIG_FILE)
	config = {...config, ...JSON.parse(new TextDecoder().decode(data))}
}



void ipsm.subscribeToBoardFeed(board => {
	void ipsm.postSync(board);
});

for (let b of config.boards) {
	void ipsm.subscribeToBoard(b, (post) => {
		void ipsm.addPost(b, post);
	});
}

cron.schedule('*/30 * * * *', async () => {
	for (let b of config.boards) {
		ipsm.announce(b);
	}
});

console.log("IPSM Relay started")
