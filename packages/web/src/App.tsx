import {AppBar, Autocomplete, Container, Grid, TextField, Toolbar, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {Post} from './components/Post';
import {useBoards} from './hooks/useBoards';
import {useIpfs} from './hooks/useIpfs';
import {PostSerializer} from './services/PostSerializer';
import {IPost} from './types/IPost';

function App() {
	const [message, setMessage] = useState('');
	const [board, setBoard] = useState<string | null>(null);
	const [posts, setPosts] = useState<IPost[]>([]);
	const [ipfs, manager] = useIpfs();

	const post = (post: IPost) => {
		if (!manager) return Promise.reject('too soon');
		return manager?.serialize(post)
			.then(PostSerializer.serialize)
			.then(p => ipfs!.pubsub.publish(`/ipsm/${board}`, p));
	};

	const postMessage = () => {
		if (ipfs) {
			post({
				content: [
					{
						mime: 'text/plain',
						data: message,
					},
				],
			})
				.finally(() => {
					setMessage('');
				});
		}
	};

	const [boards, addBoard] = useBoards();

	useEffect(() => {
		if (ipfs) {
			let topic = '/ipsm/-';
			void ipfs.pubsub.subscribe(topic, (msg) => {
				addBoard(new TextDecoder().decode(msg.data));
			});

			return () => {
				void ipfs.pubsub.unsubscribe(topic);
			};
		}
	}, [ipfs]);

	useEffect(() => {
		if (ipfs && board) {
			addBoard(board);
			const topic = `/ipsm/${board}`;
			void ipfs.pubsub.subscribe(topic, (msg) => {
				const data = PostSerializer.deserialize(msg.data);
				manager?.deserialize(data)
					.then(post => setPosts(p => [post, ...p]))
					.catch(console.error);
			});

			return () => {
				setPosts([]);
				void ipfs.pubsub.unsubscribe(topic);
			};
		}
	}, [board, ipfs]);

	return (
		<Container>
			<AppBar color={'secondary'}>
				<Toolbar>
					<Autocomplete
						freeSolo
						disablePortal
						options={boards}
						size={'small'}
						sx={{width: 300}}
						value={board}
						onChange={(e, v) => {
							setBoard(v);
							if (v) {
								ipfs?.pubsub.publish(`/ipsm/-`, new TextEncoder().encode(v));
							}
						}}
						renderInput={(params) => <TextField {...params} label="Board"/>}
					/>
					<Typography>Current: {board != null ? `/ipsm/${board}` : <i>none</i>}</Typography>
				</Toolbar>
			</AppBar>
			<main style={{marginTop: 75}}>
				{board != null && <>
					{/*<PostForm onSubmit={post}/>*/}
                    <input onChange={(e) => setMessage(e.target.value)} value={message}/>
                    <button onClick={postMessage}>Post</button>
                </>}
				<Grid container>
					{posts.map((p, i) => <Grid item key={i}><Post data={p}/></Grid>)}
				</Grid>
			</main>
		</Container>
	);
}

export default App;
