import { EditOutlined, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useNotify from "../../hooks/useNotify";
import ModalCreateBoard from "./components/ModalCreateBoard";
import { useNavigate, useSearchParams } from "react-router";
import type { BoardType } from "../../types/board.type";
import { useBoard } from "../../hooks/useBoard";

const DashboardHome = () => {
    const { notify, contextHolder } = useNotify();
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams.get("filter"));
    

    // reducer
    const board = useBoard();

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

    const getBackground = (b: BoardType) => (b.backdrop ? { backgroundImage: `url(${b.backdrop})` } : { backgroundColor: b.color || "#FFFFFF" });

    const boardJSX = (
        <>
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
                {board &&
                    board
                        .filter((board) => !board.is_starred)
                        .map((b) => {
                            return (
                                <div
                                    key={b.id}
                                    className={`rounded bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group cursor-pointer`}
                                    style={{ ...getBackground(b) }}
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

                <div className="rounded bg-gray-300 w-[270px] h-[130px] flex justify-center items-center">
                    <Button className="!bg-transparent !border-[#6C757D]" onClick={showModal}>
                        {t("create-new-board")}
                    </Button>
                </div>
            </div>
        </>
    );

    const starBoard = (
        <>
            <div className="flex justify-between mt-4">
                <h1 className="font-bold text-3xl">
                    <StarOutlined /> {t("starred-boards")}
                </h1>
            </div>

            <hr className="my-4 text-gray-500" />
            <div className="flex gap-5 px-3 flex-wrap">
                {board &&
                    board
                        .filter((board) => board.is_starred)
                        .map((b) => {
                            return (
                                <div
                                    key={b.id}
                                    className={`rounded bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group cursor-pointer`}
                                    style={{ ...getBackground(b) }}
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
            </div>
        </>
    );

    return (
        <div>
            {contextHolder}
            {searchParams.get("filter") === "board" && boardJSX}
            {searchParams.get("filter") === "starBoard" && starBoard}
            {!searchParams.get("filter") && <>{boardJSX} {starBoard}</>}

            <ModalCreateBoard open={isModalOpen} editId={editId} onCancel={handleModalCancel} onOk={handleModalOk}></ModalCreateBoard>
        </div>
    );
};

export default DashboardHome;
