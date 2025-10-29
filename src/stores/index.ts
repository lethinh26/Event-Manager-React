import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { boardReducer } from "./slices/board/board.slice";
import { userReducer } from "./slices/user/user.slice";

const RootReducer = combineReducers({
    user: userReducer,
    board: boardReducer,

})

export const store = configureStore({
    reducer: RootReducer,
})

export type StoreType = ReturnType<typeof RootReducer>;
export type AppDispatch = typeof store.dispatch;