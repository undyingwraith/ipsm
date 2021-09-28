import {CID, create} from 'ipfs-http-client';
// @ts-ignore
import NodeRSA from 'node-rsa';
import {PostManager} from '../../dist';

describe('PostManager', () => {
	let key: NodeRSA = new NodeRSA();
	let ipfs = create();
	key.importKey(' -----BEGIN RSA PRIVATE KEY-----\n' +
		'MIIBOgIBAAJBAJ0tepVC71lKlFlIuZidXiI/E+NCRremSzw9yY/vgwZLJK1AkjE3\n' +
		'4Y57Ld3jwYMNtAynWW7GUJpGEiIOdm2oPgsCAwEAAQJAZbAmvqqvb3VwxNLoQHSP\n' +
		'klh85WrblbVgt3jCDv1GJ6sx5kP2GZiaqHDDjTVku/fwd2MtERpWtvh/vnS3G4SI\n' +
		'AQIhANUpi9d1koSSQo0J6MzUCNRhDBIhw7NQh09NfLNphKCrAiEAvMO4CTCkFOma\n' +
		'tIwmUbRy7UuoMk/dFb68sRwgOAB+mCECIGceaiAZKIApoThJiu1Lxdm3+Pbsjpe4\n' +
		'ZTzf52uDqD1xAiBOfkRk7ekNGSbPtQeqKhMwQamrYjJY/HuSWlO7ddkugQIhAIEx\n' +
		'dlytCHRNxvrE50NvTU3mzwKQxsQyz4p2uWM8AsaW\n' +
		'-----END RSA PRIVATE KEY-----', 'private');

	it('can serialize', async () => {
		const man = new PostManager(ipfs, key);
		const r = await man.serialize({
			title: 'test',
			content: [
				{
					mime: 'image/jpeg',
					data: CID.parse('bafybeiafrpc6aquayjvpimpupoluvzgokrlqk6fowhw7wqb2f5gwj2tadi'),
				},
			],
		});

		expect(r.from.toString()).toEqual('bafyreieezon4tzsyjun7lvwepxdbc5irx3dpltxopjpziyh4qh362nxsy4');

		//TODO: verify content
		//TODO: verify sig
	});

	it('can deserialize', async () => {
		const man = new PostManager(ipfs, key);
		const post = await man.deserialize({
			from: CID.parse('bafyreieezon4tzsyjun7lvwepxdbc5irx3dpltxopjpziyh4qh362nxsy4'),
			data: CID.parse('bafyreihc5huaroxpupnflkprl65nak4gmmebap6eybthg3mbgensonozqy'),
			sigs: CID.parse('bafyreicp4e6trirybbtknfeck43neqig6x6l67l3alkjw4s5mn6l4ar2wq'),
		});

		expect(post.title).toEqual('test');
	});
});
