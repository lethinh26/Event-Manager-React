import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../../../apis";
import type { DataType, IdType, LocationType } from "../../../apis/core/board.api";

export const thunkGet = createAsyncThunk(
    "boardEntity/fetchBoards",
    async ({ location, idLocation, id }: { location: LocationType; idLocation: IdType[LocationType]; id: string }) => {
        const boards = await Api.board.get(location, idLocation, id);
        return { location, data: boards };
    }
);

export const thunkPost = createAsyncThunk("boardEntity/postBoard", async ({ location, data }: { location: LocationType; data: DataType[LocationType] }) => {
    const newBoard = await Api.board.post(location, data);
    return { location, data: newBoard };
});

export const thunkUpdate = createAsyncThunk(
    "boardEntity/updateBoard",
    async ({ location, id, data }: { location: LocationType; id: string; data: Partial<DataType[LocationType]> }) => {
        const updatedBoard = await Api.board.update(location, id, data);
        return { location, data: updatedBoard };
    }
);

export const thunkDelete = createAsyncThunk("boardEntity/deleteBoard", async ({ location, id }: { location: LocationType; id: string }) => {
    await Api.board.delete(location, id);
    return { location, id: id };
});
