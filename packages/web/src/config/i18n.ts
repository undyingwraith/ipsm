import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import en_json from '../locales/en.out.json'
import de_json from '../locales/de.out.json'
import it_json from '../locales/it.out.json'
import nl_json from '../locales/nl.out.json'

const resources = {
	en: {
		translation: en_json
	},
	de: {
		translation: de_json
	},
	it: {
		translation: it_json
	},
	nl: {
		translation: nl_json
	},
}
void i18n
	// .use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'nl',
		debug: false,

		interpolation: {
			escapeValue: false,
		},

	});


export default i18n;
