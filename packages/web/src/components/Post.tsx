import {Avatar, Card, CardContent, CardHeader} from '@mui/material';
import {useAsyncMemo} from 'use-async-memo';
import {IPost} from '../types/IPost';
import {PostContent} from './PostContent';
import {sha1} from 'crypto-hash';

export interface PostProps {
	data: IPost;
}

export const Post = (props: PostProps) => {
	const sender = useAsyncMemo(async () => {
		return props.data.from ? await sha1(props.data.from) : undefined;
	}, [props.data.from]);
	return <Card>
		<CardHeader
			avatar={
				<Avatar src={sender && `https://www.gravatar.com/avatar/${sender}?d=identicon`}>
					{sender?.substr(0, 2)}
				</Avatar>
			}
			title={sender}
			subheader={props.data.ts}
		/>
		{props.data.content.map((c, k) => <CardContent key={k}>
			<PostContent data={c}/>
		</CardContent>)}
	</Card>;
};
