import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { StoreType } from "../stores";

const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;
export default useAppSelector;