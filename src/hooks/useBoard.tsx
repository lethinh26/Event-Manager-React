import { useEffect } from "react";
import useAppDispatch from "./useAppDispatch";
import useAppSelector from "./useAppSelector";
import { thunkFetchUser } from "../stores/slices/user/user.thunk";
import { thunkGet } from "../stores/slices/boardEntity/boardEntity.thunk";
import { selectAllBoards } from "../stores/slices/boardEntity/boardEntity.slice";

export const useBoard = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(thunkFetchUser());
    }, [dispatch]);

    useEffect(() => {
        if (user.user?.id) {
            dispatch(thunkGet({ location: "boards", idLocation: "user_id", id: user.user.id }));
        }
    }, [dispatch, user.user?.id]);

    const board = useAppSelector(selectAllBoards);
    return board;
};
