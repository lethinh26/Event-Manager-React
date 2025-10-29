import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../../../apis";
import type { BoardType } from "../../../types/board.type";

export const thunkFetchBoards = createAsyncThunk(
    "board/fetchBoards",
    async (userId: string) => {
        const boards = await Api.board.getBoard(userId);        
        return boards;
    }
)

export const thunkPostBoard = createAsyncThunk(
    "board/postBoard",
    async (data: BoardType) => {
        const newBoard = await Api.board.postBoard(data);
        return newBoard;
    }
)

export const thunkUpdateBoard = createAsyncThunk(
    "board/updateBoard",
    async ({boardId, data}: {boardId: string, data: BoardType}) => {
        const updatedBoard = await Api.board.updateBoard(boardId, data);
        return updatedBoard;
    }
)
