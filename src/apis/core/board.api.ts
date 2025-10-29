import axios from "axios"
import type { BoardType } from "../../types/board.type";


export const boardApi = {
    getBoard: async (userId: string) => {        
        const res = await axios.get(`${import.meta.env.VITE_DB_URL}/boards?userId=${userId}`);
        if (res.data.length === 0) {
            return [];
        }

        return res.data;
    },

    postBoard: async (data: BoardType) => {
        const res = await axios.post(`${import.meta.env.VITE_DB_URL}/boards`, data);
        return res.data;
    },

    updateBoard: async (boardId: string, data: BoardType) => {
        const res = await axios.put(`${import.meta.env.VITE_DB_URL}/boards/${boardId}`, data);
        return res.data;
    }
}