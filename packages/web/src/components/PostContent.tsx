import {LinearProgress} from '@mui/material';
import {IPostContent} from '@undyingwraith/ipsm-core';
import {CID} from 'ipfs-http-client';
import {useAsyncMemo} from 'use-async-memo';
import {useIpsm} from '../hooks/useIpsm';

export interface PostContentProps {
	data: IPostContent;
}

export const PostContent = (props: PostContentProps) => {
	const {data} = props;
	const ipsm = useIpsm();


	const content = useAsyncMemo(async () => {
		const cid = CID.parse(data.data);
		switch (data.mime) {
			case 'text/html':
				return <div dangerouslySetInnerHTML={{__html: await ipsm?.readFile(cid) ?? ''}}/>;
			case 'text/plain':
			case 'text/markdown':
				return <p>{await ipsm?.readFile(cid)}</p>;
			case 'image/jpg':
			case 'image/png':
			case 'image/webp':
				return <img src={`https://ipfs.io/ipfs/${cid.toString()}`} alt={cid.toString()}/>;
			default:
				return <p><i>Encountered unknown mime type</i>: {data.mime}</p>;
		}
	}, [data]);

	return content ?? <LinearProgress color="secondary"/>;
};
