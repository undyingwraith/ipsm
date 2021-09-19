import {Autocomplete as MuiAutocomplete, TextField} from '@mui/material';
import React from 'react';

export interface AutocompleteProps {
	options: (string | {label: string})[]
	value: string | {label: string}
	onChange: (value: any) => void
	label: string
}

export const Autocomplete = (props: AutocompleteProps) => {
	return <MuiAutocomplete
		freeSolo={true}
		disablePortal={true}
		options={props.options}
		sx={{width: 300}}
		value={props.value}
		onChange={(e, v) => {
			props.onChange(v)
		}}
		renderInput={(params) => <TextField {...params} label={props.label}/>}
	/>
};
