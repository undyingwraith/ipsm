import {useCallback, useState} from 'react';
import {BoardStorageService} from '../services/BoardStorageService';

export const useBoards = ():[string[], ((board: string) => void)] => {
	const [boards, setBoards] = useState<string[]>(BoardStorageService.getBoards());

	const addBoard = useCallback((board: string) => {
		BoardStorageService.addBoard(board)
		setBoards(BoardStorageService.getBoards())
	}, [boards, setBoards]);

	return [boards, addBoard];
};
