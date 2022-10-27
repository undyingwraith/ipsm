import {AppBar, Box, Button, CircularProgress, Container, Grid, Paper, TextField, Toolbar} from '@mui/material';
import {green} from '@mui/material/colors';
import {IPost} from '@undyingwraith/ipsm-client';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BoardSelector} from './components/BoardSelector';
import {ProfileDialog} from './components/dialog/ProfileDialog';
import {SettingsDialog} from './components/dialog/SettingsDialog';
import {MenuButton} from './components/MenuButton';
import {Post} from './components/Post';
import {useBoards} from './hooks/useBoards';
import {useIpsm} from './hooks/useIpsm';

function App() {
	const [message, setMessage] = useState('');
	const [board, setBoard] = useState<string | null>(null);
	const [posts, setPosts] = useState<IPost[]>([]);
	const [loading, setLoading] = useState(false);
	const [posting, setPosting] = useState(false);
	const [dialog, setDialog] = useState<'profile' | 'settings'>();
	const [_t] = useTranslation();
	const ipsm = useIpsm();

	const postMessage = () => {
		if (ipsm && board) {
			setPosting(true);
			ipsm.getIpfs().dag.put(new TextEncoder().encode(message))
				.then(r => ipsm.postToBoard(board, {
					content: [
						{
							mime: 'text/plain',
							data: r,
						},
					],
				}))
				.finally(() => {
					setPosting(false);
					setMessage('');
				});
		}
	};

	const [boards, addBoard] = useBoards();

	useEffect(() => {
		if (ipsm) {
			void ipsm.subscribeToBoardFeed(board => {
				addBoard(board);
				void ipsm.postSync(board);
			});

			return () => {
				void ipsm.unsubFromBoardFeed();
			};
		}
	}, [ipsm]);

	useEffect(() => {
		if (ipsm && board) {
			addBoard(board);
			void ipsm.subscribeToBoard(board, (post) => {
				setPosts(p => [post, ...p]);
				void ipsm.addPost(board, post);
			});

			return () => {
				void ipsm.unsubFromBoard(board);
			};
		}
	}, [board, ipsm]);

	const loadMore = () => {
		if (board && ipsm) {
			setLoading(true);
			ipsm.getPosts(board, posts.length)
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
					<BoardSelector
						boards={boards}
						board={board}
						onChange={(v) => {
							setBoard(v);
							if (v && ipsm) {
								ipsm.getPosts(v).then(setPosts).catch(console.error);
								void ipsm.announce(v);
							} else {
								setPosts([]);
							}
						}}
					/>
					<div style={{flexGrow: 1}}/>
					<MenuButton
						onProfileClick={() => setDialog('profile')}
						onSettingsClick={() => setDialog('settings')}
					/>
				</Toolbar>
			</AppBar>
			<main style={{marginTop: 75}}>
				{board != null && <Paper style={{marginBottom: 15, padding: 10}}>
					{/*<PostForm onSubmit={post}/>*/}
                    <TextField
                        label={_t('WriteSomething')}
                        size={'small'}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={posting}
                    />
                    <Button onClick={postMessage} disabled={posting}>{_t('Post')}</Button>
                </Paper>}
				<Grid container spacing={3}>
					{posts.map((p, i) => <Grid item key={i} xs={12}><Post data={p}/></Grid>)}
				</Grid>
				<Box sx={{m: 1, position: 'relative'}}>
					<Button
						onClick={loadMore}
						style={{
							margin: '0 auto',
							display: 'block',
						}}
					>{_t('LoadMore')}</Button>
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
			<ProfileDialog
				open={dialog === 'profile'}
				onClose={() => setDialog(undefined)}
			/>
			<SettingsDialog
				open={dialog === 'settings'}
				onClose={() => setDialog(undefined)}
			/>
		</Container>
	);
}

export default App;
