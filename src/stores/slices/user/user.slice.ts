import { createSlice } from "@reduxjs/toolkit";
import type { UserType } from "../../../types/user.type";
import { thunkFetchUser } from "./user.thunk";

interface UserState {
    user: UserType | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(thunkFetchUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(thunkFetchUser.fulfilled, (state, action) => {
            state.loading = false;                        
            state.user = action.payload;
        });

        builder.addCase(thunkFetchUser.rejected, (state) => {
            state.loading = false;
            state.user = null;
        });
    }
});

export const userReducer = userSlice.reducer;