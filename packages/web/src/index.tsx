import {ThemeProvider} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {theme} from './theme';
import {I18nextProvider} from 'react-i18next';
import i18n from './config/i18n';

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<I18nextProvider i18n={i18n}>
				<App/>
			</I18nextProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
