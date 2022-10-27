import {create} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {useMemo} from 'react';
import {IpsmClientApp} from '@undyingwraith/ipsm-client';

export const useIpsm = () => {
	const ipfs = useMemo(() => {
		return create({
			url: '/ip4/127.0.0.1/tcp/5001',
		});
	}, []);

	const identity = useMemo(() => {
		const identity = localStorage.getItem('identity');
		const key = new NodeRSA();

		if (identity) {
			key.importKey(identity, 'pkcs8');
		} else {
			key.generateKeyPair(512);
			localStorage.setItem('identity', key.exportKey('pkcs8'));
		}
		return key;
	}, []);

	return useMemo(() => {
		if (ipfs && identity) {
			return new IpsmClientApp(ipfs, identity);
		}
	}, [ipfs, identity]);
};
