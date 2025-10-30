import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../../../apis";
import type { DataType, IdType, LocationType } from "../../../apis/core/board.api";

export const thunkGet = createAsyncThunk(
    "board/fetchBoards",
    async ({location, idLocation, id}: {location: LocationType, idLocation: IdType[LocationType], id: string}) => {        
        const boards = await Api.board.get(location, idLocation, id);        
        return {location, data: boards};
    }
)

export const thunkPost = createAsyncThunk(
    "board/postBoard",
    async ({location, data}: {location: LocationType, data: DataType[LocationType]}) => {
        const newBoard = await Api.board.post(location, data);
        return {location, data: newBoard};
    }
)

export const thunkUpdate = createAsyncThunk(
    "board/updateBoard",
    async ({location, id, data}: {location: LocationType, id: string, data: DataType[LocationType]}) => {
        const updatedBoard = await Api.board.update(location, id, data);
        return {location, data: updatedBoard};
    }
)

export const thunkDelete = createAsyncThunk(
    "board/deleteBoard",
    async ({location, id}: {location: LocationType, id: string}) => {
        const deletedBoard = await Api.board.delete(location, id);
        return {location, id: id};
    }
)