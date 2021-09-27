import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IDialogProps} from './IDialogProps';

export const ProfileDialog = (props: IDialogProps) => {
	const {open, onClose} = props;
	const [_t] = useTranslation();

	return <Dialog
		open={open}
		onClose={onClose}
	>
		<Toolbar>
			<IconButton
				edge="start"
				color="inherit"
				onClick={onClose}
				aria-label="close"
			>
				<CloseIcon/>
			</IconButton>
			<Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
				{_t('Profile')}
			</Typography>
			<Button autoFocus color="inherit" onClick={onClose}>
				{_t('Save')}
			</Button>
		</Toolbar>
		<List>
			<ListItem button>
				<ListItemText primary="Phone ringtone" secondary="Titania"/>
			</ListItem>
			<Divider/>
			<ListItem button>
				<ListItemText
					primary="Default notification ringtone"
					secondary="Tethys"
				/>
			</ListItem>
		</List>
	</Dialog>;
};
