export class BoardStorageService {
	public static getBoards(): string[] {
		const stored = localStorage.getItem('boards');

		return stored ? JSON.parse(stored) : [];
	}

	public static addBoard(board: string) {
		localStorage.setItem('boards', JSON.stringify([...BoardStorageService.getBoards().filter(s => s !== board), board].sort()));
	}
}
