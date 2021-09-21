import {create, IPFSHTTPClient} from 'ipfs-http-client';
import {useMemo} from 'react';
import {BoardStorageService} from '../services/BoardStorageService';

export const useIpfs = (): [IPFSHTTPClient, BoardStorageService| undefined] => {
	const ipfs = useMemo(() => {
		return create({
			url: '/ip4/127.0.0.1/tcp/5001',
		})
	}, [])

	const boardService = useMemo(() => {
		return ipfs ? new BoardStorageService(ipfs) : undefined
	}, [ipfs])

	return [ipfs, boardService]
}
