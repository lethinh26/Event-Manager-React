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
                    state.loading = false;
                    state.initialized = true;
                    break;
                case "lists":
                    listAdapter.upsertMany(state.lists, data as ListType[]);                    
                    break;
                case "tasks":
                    taskAdapter.upsertMany(state.tasks, data as TaskType[]);
                    break;
                case "tags":
                    tagAdapter.upsertMany(state.tags, data as TagType[]);
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
                    boardAdapter.updateOne(state.boards, {id: data.id, changes: data as Partial<BoardType>});
                    break;
                case "lists":
                    listAdapter.updateOne(state.lists, {id: data.id, changes: data as Partial<ListType>});
                    break;
                case "tasks":
                    taskAdapter.updateOne(state.tasks, {id: data.id, changes: data as Partial<TaskType>})
                    break;
                case "tags":
                    tagAdapter.updateOne(state.tags, {id: data.id, changes: data as Partial<TagType>})
                    break;
                default:
                    console.warn("Lỗi location", location);
            }
        });

        b.addCase(thunkGet.pending, (state, action) => {
            if (action.meta.arg.location === "boards") {
                state.loading = true;
            }
            state.error = null;
        });

        b.addCase(thunkGet.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message ?? "Failed fetch";
        });

        b.addCase(thunkPost.rejected, (state, action) => {
            state.error = action.error?.message ?? "Failed create";
        });

        b.addCase(thunkUpdate.rejected, (state, action) => {
            state.error = action.error?.message ?? "Failed update";
        });

        b.addCase(thunkDelete.rejected, (state, action) => {
            state.error = action.error?.message ?? "Failed delete";
        });
    },
});

const selectBoardEntity = (state: StoreType) => state.boardEntity;

const boardSelectors = boardAdapter.getSelectors<StoreType>((state) => selectBoardEntity(state).boards);
const listSelectors = listAdapter.getSelectors<StoreType>((state) => selectBoardEntity(state).lists);
const taskSelectors = taskAdapter.getSelectors<StoreType>((state) => selectBoardEntity(state).tasks);
const tagSelectors = tagAdapter.getSelectors<StoreType>((state) => selectBoardEntity(state).tags);


export const selectAllBoards = boardSelectors.selectAll
export const selectAllLists = listSelectors.selectAll
export const selectAllTasks = taskSelectors.selectAll
export const selectAllTags = tagSelectors.selectAll

export const boardEntityReducer = boardEntitySlice.reducer;
