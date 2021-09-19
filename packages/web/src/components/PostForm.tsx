import {useState} from 'react';
import {IPost} from '../types/IPost';
import {IPostContent} from '../types/IPostContent';
import {ContentForm} from './ContentForm';

export interface PostFormProps {
	onSubmit: (post: IPost) => Promise<void>;
}

export const PostForm = (props: PostFormProps) => {
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState<IPostContent[]>([]);

	const addContent = () => {
		setContent(c => [...c, {
			mime: '',
			data: null,
		}]);
	};

	return <form
		onSubmit={(e) => {
			e.preventDefault();
			setLoading(true);
			props.onSubmit({
				content: content,
			}).finally(() => {
				setLoading(false);
			});
		}
		}>
		{content.map((c, k) => <ContentForm disabled={loading} key={k} onChange={() => {
			//
		}}/>)}
		<button onClick={addContent} disabled={loading}>Add content block</button>
		<button type={'submit'} disabled={loading}>Post</button>
	</form>;
};
