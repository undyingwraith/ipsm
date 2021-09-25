import {Box, ButtonGroup, Tab, Tabs, TextField} from '@mui/material';
import {useState} from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {useTranslation} from 'react-i18next';
import {IDialogProps} from './IDialogProps';

interface SettingsDialogProps extends IDialogProps {
	onSave?: (data: any) => void;
	//
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function TabPanel(props: any & { index: number, value: number }) {
	const {children, value, index, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{p: 3}}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export const SettingsDialog = (props: SettingsDialogProps) => {
	const {open, onClose} = props;
	const [tab, setTab] = useState(0);
	const [_t] = useTranslation();

	return <Dialog
		fullScreen
		open={open}
		onClose={onClose}
	>
		<AppBar sx={{position: 'relative'}}>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					onClick={onClose}
					aria-label="close"
				>
					<CloseIcon/>
				</IconButton>
				<Typography sx={{ml: 2}} variant="h6" component="div">
					{_t('Settings')}
				</Typography>
				<Tabs sx={{ml: 2, flex: 1}} value={tab} onChange={(e, v) => setTab(v)}>
					<Tab label={_t('Settings.General')} {...a11yProps(0)} />
					<Tab label={_t('Settings.Identity')} {...a11yProps(1)} />
					<Tab label={_t('Settings.Ipfs')} {...a11yProps(2)} />
				</Tabs>
				<Button autoFocus color="inherit" onClick={onClose}>{_t('Save')}</Button>
			</Toolbar>
		</AppBar>
		<TabPanel
			value={tab}
			index={0}
		>
			General settings
		</TabPanel>
		<TabPanel
			value={tab}
			index={1}
		>
			<code style={{
				display: 'block',
			}}>
				Public key
			</code>
			<ButtonGroup>
				<Button>{_t('Settings.Identity.Import')}</Button>
				<Button>{_t('Settings.Identity.Export')}</Button>
			</ButtonGroup>
		</TabPanel>
		<TabPanel
			value={tab}
			index={2}
		>
			<TextField
				label={_t('Settings.Ipfs.Url')}
				placeholder={'/ip4/127.0.0.1/tcp/5001'}
				// value={}
			/>
		</TabPanel>
	</Dialog>;
};
