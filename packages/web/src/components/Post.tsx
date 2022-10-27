import {Avatar, Card, CardContent, CardHeader} from '@mui/material';
import {IPost} from '@undyingwraith/ipsm-client';
import {PostContent} from './PostContent';

export interface PostProps {
	data: IPost;
}

export const Post = (props: PostProps) => {

	return <Card>
		<CardHeader
			avatar={
				<Avatar src={props.data.from && `https://www.gravatar.com/avatar/${props.data.from.toString()}?d=identicon`}>
					{props.data.from?.toString()?.substr(0, 2)}
				</Avatar>
			}
			title={props.data.from?.toString()}
			subheader={props.data.ts}
		/>
		{props.data.content.map((c, k) => <CardContent key={k}>
			<PostContent data={c}/>
		</CardContent>)}
	</Card>;
};
