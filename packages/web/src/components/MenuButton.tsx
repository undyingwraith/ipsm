import {Avatar, IconButton, Menu, MenuItem} from '@mui/material';
import React from 'react';
import {useTranslation} from 'react-i18next';

export const MenuButton = () => {
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
			<MenuItem onClick={handleClose}>{_t('Menu.Profile')}</MenuItem>
			<MenuItem onClick={handleClose}>{_t('Menu.Account')}</MenuItem>
		</Menu>
	</>;
};
