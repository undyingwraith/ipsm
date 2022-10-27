import {LinearProgress} from '@mui/material';
import {IPostContent} from '@undyingwraith/ipsm-client';
import {useAsyncMemo} from 'use-async-memo';
import {useIpsm} from '../hooks/useIpsm';

export interface PostContentProps {
	data: IPostContent;
}

export const PostContent = (props: PostContentProps) => {
	const {data} = props;
	const ipsm = useIpsm();


	const content = useAsyncMemo(async () => {
		switch (data.mime) {
			case 'text/html':
				return <div dangerouslySetInnerHTML={{__html: await ipsm?.readFile(data.data) ?? ''}}/>;
			case 'text/plain':
			case 'text/markdown':
				return <p>{await ipsm?.readFile(data.data)}</p>;
			case 'image/jpg':
			case 'image/png':
			case 'image/webp':
				return <img src={`https://ipfs.io/ipfs/${data.data.toString()}`} alt={data.data.toString()}/>;
			default:
				return <p><i>Encountered unknown mime type</i>: {data.mime}</p>;
		}
	}, [data]);

	return content ?? <LinearProgress color="secondary"/>;
};
