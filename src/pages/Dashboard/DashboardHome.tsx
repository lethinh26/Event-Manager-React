import { EditOutlined, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import { useEffect, useState, type JSX } from "react";
import { useTranslation } from "react-i18next";
import useNotify from "../../hooks/useNotify";
import ModalCreateBoard from "./components/ModalCreateBoard";
import { useNavigate, useSearchParams } from "react-router";
import type { BoardType } from "../../types/board.type";
import { useBoard } from "../../hooks/useBoard";
import { thunkDelete, thunkUpdate } from "../../stores/slices/boardEntity/boardEntity.thunk";
import useAppDispatch from "../../hooks/useAppDispatch";

const DashboardHome = () => {
    const { notify, contextHolder } = useNotify();
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();

    // reducer
    const board = useBoard();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [boardsState, setBoardsState] = useState<{ title: JSX.Element; board: BoardType[] }>({ title: <></>, board: [] });

    useEffect(() => {
        let title: JSX.Element;
        let filteredBoards: BoardType[] = [];

        if (searchParams.get("filter") === "board") {
            title = (
                <div className="flex justify-between">
                    <h1 className="font-bold text-3xl">
                        <UnorderedListOutlined /> {t("your-workspaces")}
                    </h1>
                    <div>
                        <Button>{t("share")}</Button>
                        <Button>{t("export")}</Button>
                        <Select>This</Select>
                    </div>
                </div>
            );
            filteredBoards = board.filter((b) => !b.is_starred && !b.is_closed);
        } else if (searchParams.get("filter") === "starBoard") {
            title = (
                <div className="flex justify-between mt-4">
                    <h1 className="font-bold text-3xl">
                        <StarOutlined /> {t("starred-boards")}
                    </h1>
                </div>
            );
            filteredBoards = board.filter((b) => b.is_starred);
        } else if (searchParams.get("filter") === "closedBoard") {
            title = (
                <div className="flex justify-between mt-4">
                    <h1 className="font-bold text-3xl">
                        <UnorderedListOutlined /> {t("closed-boards")}
                    </h1>
                </div>
            );
            filteredBoards = board.filter((b) => b.is_closed);
        }

        setBoardsState((prevState) => {
            if (prevState.title !== title || prevState.board !== filteredBoards) {
                return { title, board: filteredBoards };
            }
            return prevState;
        });
    }, [searchParams, board, t]);

    const showModalEdit = (board?: string) => {
        setEditId(board ?? null);
        setIsModalOpen(true);
    };

    const handleModalOk = () => {
        const action = editId ? t("board.update") : t("board.create");
        notify(true, t("board.message", { action }));
        setIsModalOpen(false);
        setEditId(null);
    };

    const handleModalCancel = () => {
        setEditId(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            {contextHolder}
            {boardsState.title}
            <hr className="my-4 text-gray-500" />

            <div className="flex gap-5 px-3 flex-wrap">
                {boardsState.board &&
                    boardsState.board.map((b) => {
                        if (searchParams.get("filter") === "closedBoard") {
                            return (
                                <div
                                    key={b.id}
                                    className="rounded bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group cursor-pointer"
                                    style={b.backdrop ? { backgroundImage: `url(${b.backdrop})` } : { backgroundColor: b.color || "#FFFFFF" }}
                                >
                                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">
                                        {b.title}
                                    </h1>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-opacity-50">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(
                                                    thunkUpdate({
                                                        location: "boards",
                                                        id: b.id,
                                                        data: { is_closed: false },
                                                    })
                                                );
                                                notify(true, t("board-reopened-successfully"));
                                            }}
                                            className="!bg-slate-800 !text-emerald-400 !border-none mx-2"
                                        >
                                            {t("reopen-board")}
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(
                                                    thunkDelete({
                                                        location: "boards",
                                                        id: b.id,
                                                    })
                                                );
                                                notify(true, t("board-deleted-successfully"));
                                            }}
                                            className="!bg-slate-800 !text-red-400 !border-none mx-2"
                                        >
                                            {t("delete-board")}
                                        </Button>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={b.id}
                                className={`rounded bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group cursor-pointer`}
                                style={{ backgroundImage: `url(${b.backdrop})` }}
                                onClick={() => navigate(`/board/${b.id}`)}
                            >
                                <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">
                                    {b.title}
                                </h1>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showModalEdit(b.id);
                                    }}
                                    className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <EditOutlined />
                                    {t("edit-this-board")}
                                </Button>
                            </div>
                        );
                    })}
                {searchParams.get("filter") === "board" && (
                    <div className="rounded bg-gray-300 w-[270px] h-[130px] flex justify-center items-center">
                        <Button className="!bg-transparent !border-[#6C757D]" onClick={showModal}>
                            {t("create-new-board")}
                        </Button>
                    </div>
                )}
            </div>

            <ModalCreateBoard open={isModalOpen} editId={editId} onCancel={handleModalCancel} onOk={handleModalOk}></ModalCreateBoard>
        </div>
    );
};

export default DashboardHome;
