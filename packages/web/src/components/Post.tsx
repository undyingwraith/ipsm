import {Avatar, Card, CardContent, CardHeader} from '@mui/material';
import {IPost} from '@undyingwraith/ipsm-core';
import {sha1} from 'crypto-hash';
import {useAsyncMemo} from 'use-async-memo';
import {PostContent} from './PostContent';

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
