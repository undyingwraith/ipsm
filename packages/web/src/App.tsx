import {
	AppBar,
	Autocomplete,
	Avatar, Box,
	Button, CircularProgress,
	Container,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	TextField,
	Toolbar,
	Typography,
} from '@mui/material';
import {green} from '@mui/material/colors';
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
	const [ipfs, manager, boardService] = useIpfs();
	const [loading, setLoading] = useState(false);

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
			const syncTopic = `/ipsm/-/${board}`;
			void ipfs.pubsub.subscribe(topic, (msg) => {
				const data = PostSerializer.deserialize(msg.data);
				manager?.deserialize(data)
					.then(post => {
						setPosts(p => [post, ...p]);
						boardService?.addPost(board, post);
					})
					.catch(console.error);
			});

			return () => {
				void ipfs.pubsub.unsubscribe(topic);
			};
		}
	}, [board, ipfs]);

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleMenu = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const loadMore = () => {
		if (ipfs && board && boardService) {
			setLoading(true);
			boardService.getPosts(board, posts.length)
				.then(posts => {
					setPosts(p => ([...p, ...posts]));
					setLoading(false);
				});
		}
	};

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
								boardService?.getPosts(v).then(setPosts).catch(console.error);
								void ipfs?.pubsub.publish(`/ipsm/-`, new TextEncoder().encode(v));
							} else {
								setPosts([]);
							}
						}}
						renderInput={(params) => <TextField {...params} label="Board"/>}
					/>
					<Typography>Current: {board != null ? `/ipsm/${board}` : <i>none</i>}</Typography>
					<div>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<Avatar>You</Avatar>
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>Profile</MenuItem>
							<MenuItem onClick={handleClose}>My account</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<main style={{marginTop: 75}}>
				{board != null && <Paper style={{marginBottom: 15, padding: 10}}>
					{/*<PostForm onSubmit={post}/>*/}
                    <TextField
                        label={'Write something...'}
                        size={'small'}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={postMessage}>Post</Button>
                </Paper>}
				<Grid container spacing={3}>
					{posts.map((p, i) => <Grid item key={i} lg={6} xs={12}><Post data={p}/></Grid>)}
				</Grid>
				<Box sx={{m: 1, position: 'relative'}}>
					<Button
						onClick={loadMore}
						style={{
							margin: '0 auto',
							display: 'block',
						}}
					>Load more</Button>
					{loading && (
						<CircularProgress
							size={24}
							sx={{
								color: green[500],
								position: 'absolute',
								top: '50%',
								left: '50%',
								marginTop: '-12px',
								marginLeft: '-12px',
							}}
						/>
					)}
				</Box>
			</main>
		</Container>
	);
}

export default App;
