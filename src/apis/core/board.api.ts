import axios from "axios"
import type { BoardType, ListType, TagType, TaskType } from "../../types/board.type";

export type LocationType = "boards" | "lists" | "tasks" | "tags";

export type IdType = {
    boards: "user_id";
    lists: "board_id";
    tasks: "list_id";
    tags: "task_id";
}

export interface DataType {
    boards: BoardType;
    lists: ListType;
    tasks: TaskType;
    tags: TagType;
}

export const boardApi = {
    get: async <T extends LocationType>(location: T, idLocation: IdType[T], id: string) => {
        const res = await axios.get(`${import.meta.env.VITE_DB_URL}/${location}?${idLocation}=${id}`);        
        return res.data;
    },

    post: async <T extends LocationType>(location: T, data: DataType[T]) => {
        const res = await axios.post(`${import.meta.env.VITE_DB_URL}/${location}`, data);
        return res.data;
    },

    update: async <T extends LocationType>(location: T, id: string, data: Partial<DataType[T]>) => {
        const res = await axios.patch(`${import.meta.env.VITE_DB_URL}/${location}/${id}`, data);
        console.log(res);
        
        return res.data;
    },

    delete: async <T extends LocationType>(location: T, id: string) => {
        const res = await axios.delete(`${import.meta.env.VITE_DB_URL}/${location}/${id}`);
        return res.data;
    }
}