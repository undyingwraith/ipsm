import {Autocomplete, TextField, Typography} from '@mui/material';
import React from 'react';
import {useTranslation} from 'react-i18next';

export interface BoardSelectorProps {
	boards: string[];
	board: string | null;
	onChange: (board: string | null) => void;
}

export const BoardSelector = (props: BoardSelectorProps) => {
	const {board, boards, onChange} = props;
	const [_t] = useTranslation()

	return <Autocomplete
		freeSolo
		disablePortal
		options={boards}
		size={'small'}
		sx={{width: 300}}
		value={board}
		onChange={(e, v) => {
			onChange(v);
		}}
		onBlur={(e) => {
			e.target.setAttribute('value', board ?? '');
		}}
		renderInput={(params) => <TextField {...params} label={_t('Board')}/>}
	/>;
};
