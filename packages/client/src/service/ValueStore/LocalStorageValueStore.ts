import {IValueStore} from './IValueStore';

export class LocalStorageValueStore implements IValueStore {
	get(key: string): any {
		return localStorage.getItem(key);
	}

	set(key: string, value: any): void {
		localStorage.setItem(key, value);
	}

}
