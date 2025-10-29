import { EditOutlined, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useNotify from "../../hooks/useNotify";
import { useSelector } from "react-redux";
import type { StoreType } from "../../stores";
import useAppDispatch from "../../hooks/useAppDispatch";
import ModalCreateBoard from "./components/ModalCreateBoard";
import { thunkFetchUser } from "../../stores/slices/user/user.thunk";
import { thunkFetchBoards } from "../../stores/slices/board/board.thunk";

const DashboardHome = () => {
    // notify / transale
    const { notify, contextHolder } = useNotify();
    const { t } = useTranslation();

    // reducer
    const dispatch = useAppDispatch();
    const user = useSelector((state: StoreType) => state.user.user);
    const boards = useSelector((state: StoreType) => state.board);

    useEffect(() => {
        dispatch(thunkFetchUser());
        dispatch(thunkFetchBoards(user?.id || ""));
    }, [dispatch, user?.id]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

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

            <hr className="my-4 text-gray-500" />

            <div className="flex gap-5 px-3 flex-wrap">
                {boards.boards &&
                    boards.boards.filter(board => !board.is_starred).map((b) => {
                        return (
                            <div
                                key={b.id}
                                className={`rounded bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group cursor-pointer`}
                                style={{ backgroundImage: `url(${b.backdrop})` }}
                            >
                                <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">
                                    {b.title}
                                </h1>
                                <Button onClick={() => showModalEdit(b.id)} className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditOutlined />
                                    {t("edit-this-board")}
                                </Button>
                            </div>
                        );
                    })}

                <div className="rounded bg-gray-300 w-[270px] h-[130px] flex justify-center items-center">
                    <Button className="!bg-transparent !border-[#6C757D]" onClick={showModal}>
                        {t("create-new-board")}
                    </Button>
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <h1 className="font-bold text-3xl">
                    <StarOutlined /> {t("starred-boards")}
                </h1>
            </div>

            <hr className="my-4 text-gray-500" />

            <div className="flex gap-5 px-3 flex-wrap">
                {boards.boards &&
                    boards.boards
                        .filter((board) => board.is_starred)
                        .map((b) => {
                            return (
                                <div
                                    key={b.id}
                                    className={`rounded bg-[url('/${b.backdrop}')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group cursor-pointer`}
                                >
                                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">
                                        {b.title}
                                    </h1>
                                    <Button onClick={() => showModalEdit(b.id)} className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditOutlined />
                                        {t("edit-this-board")}
                                    </Button>
                                </div>
                            );
                        })}
            </div>

            <ModalCreateBoard open={isModalOpen} editId={editId} onCancel={handleModalCancel} onOk={handleModalOk}></ModalCreateBoard>
        </div>
    );
};

export default DashboardHome;
