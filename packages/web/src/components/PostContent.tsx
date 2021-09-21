import {LinearProgress} from '@mui/material';
import {IPostContent} from '@undyingwraith/ipsm-core';
import {CID} from 'ipfs-http-client';
import {concat} from 'uint8arrays';
import {useAsyncMemo} from 'use-async-memo';
import {useIpfs} from '../hooks/useIpfs';

export interface PostContentProps {
	data: IPostContent;
}

export const PostContent = (props: PostContentProps) => {
	const {data} = props;
	const [ipfs] = useIpfs();

	const readFile = async (cid: CID): Promise<string> => {
		const chunks = [];

		for await (const chunk of ipfs.cat(cid)) {
			chunks.push(chunk);
		}

		return new TextDecoder().decode(concat(chunks));
	};

	const content = useAsyncMemo(async () => {
		const cid = CID.parse(data.data);
		switch (data.mime) {
			case 'text/html':
				return <div dangerouslySetInnerHTML={{__html: await readFile(cid)}}/>;
			case 'text/plain':
				return <p>{await readFile(cid)}</p>;
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
