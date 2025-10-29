import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../../../apis";

export const thunkFetchUser = createAsyncThunk(
    "user/fetchUser",
    async () => {
        const user = await Api.user.getUser();
        return user;
    }
)