import {create, IPFSHTTPClient} from 'ipfs-http-client';
import NodeRSA from 'node-rsa';
import {useMemo} from 'react';
import {BoardStorageService} from '../services/BoardStorageService';
// import {v4 as uuid} from 'uuid';
import {PostManager} from '../services/PostManager';

export const useIpfs = (): [IPFSHTTPClient, PostManager | undefined, BoardStorageService| undefined] => {
	// const keyPass = useMemo(() => uuid(), [])

	const ipfs = useMemo(() => {
		return create({
			url: '/ip4/127.0.0.1/tcp/5001',
		})
	}, [])

	const key = useMemo( () => {
		const identity = localStorage.getItem('identity')
		const key = new NodeRSA()

		if (identity) {
			key.importKey(identity, 'pkcs8');
		} else {
			key.generateKeyPair(512)
			localStorage.setItem('identity', key.exportKey('pkcs8'))
		}
		return key
	}, [])

	const postManager = useMemo(() => {
		return ipfs && key ? new PostManager(ipfs, key) : undefined
	}, [ipfs, key])

	const boardService = useMemo(() => {
		return ipfs ? new BoardStorageService(ipfs) : undefined
	}, [ipfs])

	return [ipfs, postManager, boardService]
}
