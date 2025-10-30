import { createEntityAdapter, createSlice, type EntityState } from "@reduxjs/toolkit";
import type { BoardType, ListType, TagType, TaskType } from "../../../types/board.type";
import { thunkDelete, thunkGet, thunkPost, thunkUpdate } from "./boardEntity.thunk";
import type { StoreType } from "../..";

type BoardState = {
    boards: EntityState<BoardType, string>;
    lists: EntityState<ListType, string>;
    tasks: EntityState<TaskType, string>;
    tags: EntityState<TagType, string>;
    loading: boolean;
    error: string | null;
    initialized: boolean;
};

const boardAdapter = createEntityAdapter<BoardType>();
const listAdapter = createEntityAdapter<ListType>();
const taskAdapter = createEntityAdapter<TaskType>();
const tagAdapter = createEntityAdapter<TagType>();

const initialState: BoardState = {
    boards: boardAdapter.getInitialState(),
    lists: listAdapter.getInitialState(),
    tasks: taskAdapter.getInitialState(),
    tags: tagAdapter.getInitialState(),
    loading: false,
    error: null,
    initialized: false,
};

const boardEntitySlice = createSlice({
    name: "boardEntity",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(thunkGet.fulfilled, (state, action) => {
            const { location, data } = action.payload;            
            switch (location) {
                case "boards":
                    boardAdapter.setAll(state.boards, data as BoardType[]);
                    break;
                case "lists":
                    listAdapter.setAll(state.lists, data as ListType[]);
                    break;
                case "tasks":
                    taskAdapter.setAll(state.tasks, data as TaskType[]);
                    break;
                case "tags":
                    tagAdapter.setAll(state.tags, data as TagType[]);
                    break;
                default:
                    console.warn("Lỗi location", location);
            }
        });

        b.addCase(thunkPost.fulfilled, (state, action) => {
            const { location, data } = action.payload;
            switch (location) {
                case "boards":
                    boardAdapter.addOne(state.boards, data as BoardType);
                    break;
                case "lists":
                    listAdapter.addOne(state.lists, data as ListType);
                    break;
                case "tasks":
                    taskAdapter.addOne(state.tasks, data as TaskType);
                    break;
                case "tags":
                    tagAdapter.addOne(state.tags, data as TagType);
                    break;
                default:
                    console.warn("Lỗi location", location);
            }
        });

        b.addCase(thunkDelete.fulfilled, (state, action) => {
            const { location, id } = action.payload;
            switch (location) {
                case "boards":
                    boardAdapter.removeOne(state.boards, id);
                    break;
                case "lists":
                    listAdapter.removeOne(state.lists, id);
                    break;
                case "tasks":
                    taskAdapter.removeOne(state.tasks, id);
                    break;
                case "tags":
                    tagAdapter.removeOne(state.tags, id);
                    break;
                default:
                    console.warn("Lỗi location", location);
            }
        });

        b.addCase(thunkUpdate.fulfilled, (state, action) => {
            const { location, data } = action.payload;
            switch (location) {
                case "boards":
                    boardAdapter.upsertOne(state.boards, data as BoardType);
                    break;
                case "lists":
                    listAdapter.upsertOne(state.lists, data as ListType);
                    break;
                case "tasks":
                    taskAdapter.upsertOne(state.tasks, data as TaskType);
                    break;
                case "tags":
                    tagAdapter.upsertOne(state.tags, data as TagType);
                    break;
                default:
                    console.warn("Lỗi location", location);
            }
        });

        b.addMatcher(
            (action) => action.type.endsWith("/pending"),
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        b.addMatcher(
            (action) => action.type.endsWith("/fulfilled") && action.type.startsWith("boardEntity/"),
            (state) => {
                state.loading = false;
            }
        );

        b.addMatcher(
            (action) => action.type.endsWith("/rejected"),
            (state, action: any) => {
                state.loading = false;
                state.error = action.error?.message ?? "errorrrrwdaw ";
            }
        );
    },
});

const selectBoardEntity = (state: StoreType) => state.boardEntity;

export const boardSelectors = boardAdapter.getSelectors<StoreType>((state) => selectBoardEntity(state).boards);
export const selectAllBoards = boardSelectors.selectAll;

export const boardEntityReducer = boardEntitySlice.reducer;
