import {LinearProgress} from '@mui/material';
import {CID} from 'ipfs-http-client';
import {useAsyncMemo} from 'use-async-memo';
import {useIpfs} from '../hooks/useIpfs';
import {IPostContent} from '../types/IPostContent';
import {concat} from 'uint8arrays';

export interface PostContentProps {
	data: IPostContent;
}

export const PostContent = (props: PostContentProps) => {
	const {data} = props;
	const [ipfs] = useIpfs();

	const content = useAsyncMemo(async () => {
		switch (data.mime) {
			case 'text/plain':
				const chunks = [];

				for await (const chunk of ipfs.cat(CID.parse(data.data))) {
					chunks.push(chunk);
				}

				return <p>{new TextDecoder().decode(concat(chunks))}</p>;
			default:
				return <p><i>Encountered unknown mime type</i>: {data.mime}</p>
		}
	}, [data]);

	return content ?? <LinearProgress color="secondary"/>
};