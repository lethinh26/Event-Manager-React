import { createSlice } from "@reduxjs/toolkit";
import type { BoardType } from "../../../types/board.type"
import { thunkFetchBoards, thunkPostBoard, thunkUpdateBoard } from "./board.thunk";

type BoardState = {
    boards: BoardType[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: BoardState = {
    boards: null,
    loading: false,
    error: null,
}

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // thunk fetch
        builder.addCase(thunkFetchBoards.pending, (state) => {
            state.loading = true;            
        });

        builder.addCase(thunkFetchBoards.fulfilled, (state, action) => {
            state.loading = false;
            state.boards = action.payload;            
        });

        builder.addCase(thunkFetchBoards.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Lỗi lấy dữ liệu Boards";        
        });

        // thunk post
        builder.addCase(thunkPostBoard.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(thunkPostBoard.fulfilled, (state, action) => {
            state.loading = false;
            state.boards = state.boards ? [...state.boards, action.payload] : [action.payload];
        });

        builder.addCase(thunkPostBoard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Lỗi thêm dữ liệu Board";
        });

        // thunk update
        builder.addCase(thunkUpdateBoard.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(thunkUpdateBoard.fulfilled, (state, action) => {
            state.loading = false;
            state.boards = state.boards?.map((board) =>
                board.id === action.payload.id ? action.payload : board
            ) || null;
        });

        builder.addCase(thunkUpdateBoard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Lỗi cập nhật dữ liệu Board";
        });
    }
})

export const boardReducer = boardSlice.reducer;