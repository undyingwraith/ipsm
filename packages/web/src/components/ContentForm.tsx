import {useEffect, useState} from 'react';
import {Autocomplete} from './atoms/Autocomplete';

export interface ContentFormProps {
	disabled?: boolean;
	onChange?: (mime: string, value: any) => void
}

export const ContentForm = (props: ContentFormProps) => {
	const [mime, setMime] = useState('');
	const [content, setContent] = useState<any>('');

	const update = () => {
		props.onChange && props.onChange(mime, content)
	}

	return <div>
		<Autocomplete
			options={[
				'text/plain',
			]}
			label={'Mime'}
			value={mime}
			onChange={(v) => {
				setMime(v)
				update()
			}}
		/>
		<input onChange={e => {
			setContent(e.target.value);
			update()
		}} value={content}/>
	</div>;
};
