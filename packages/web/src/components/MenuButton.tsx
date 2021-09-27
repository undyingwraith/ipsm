import {Avatar, Divider, IconButton, Menu, MenuItem} from '@mui/material';
import React from 'react';
import {useTranslation} from 'react-i18next';

export interface MenuButtonProps {
	onProfileClick?: () => void;
	onSettingsClick?: () => void;
	onLogoutClick?: () => void;
}

export const MenuButton = (props: MenuButtonProps) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [_t] = useTranslation();

	const handleMenu = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return <>
		<IconButton
			size="large"
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
			<MenuItem onClick={() => {
				handleClose();
				props.onProfileClick && props.onProfileClick();
			}}>{_t('Menu.Profile')}</MenuItem>
			<MenuItem onClick={() => {
				handleClose();
				props.onSettingsClick && props.onSettingsClick();
			}}>{_t('Menu.Settings')}</MenuItem>
			<Divider/>
			<MenuItem onClick={() => {
				handleClose();
				props.onLogoutClick && props.onLogoutClick();
			}}>{_t('Menu.Logout')}</MenuItem>
		</Menu>
	</>;
};
