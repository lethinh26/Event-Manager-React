import { EditOutlined, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalDashboard from "./components/ModalDashboard";
import useNotify from "../../hooks/useNotify";


const DashboardHome = () => {
    const {notify, contextHolder} = useNotify()
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showModalEdit = () => {
        setIsEditing(true);
        setIsModalOpen(true)
    };

    const hanleModalOk = () => {
        const action = isEditing ? t("board.update") : t("board.create")
        notify(true, t("board.message", { action }))
        setIsModalOpen(false);
        setIsEditing(false)
    };

    const hanleModalCancel = () => {     
        setIsModalOpen(false);
        setIsEditing(false)
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
                <div className="rounded bg-[url('/board-default1.jpg')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group">
                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">Hello</h1>
                    <Button className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditOutlined />
                        {t("edit-this-board")}
                    </Button>
                </div>
                <div className="rounded bg-[url('/board-default2.jpg')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group">
                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">Hello</h1>
                    <Button className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditOutlined />
                        {t("edit-this-board")}
                    </Button>
                </div>
                <div className="rounded bg-[url('/board-default3.jpg')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group">
                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">Hello</h1>
                    <Button className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditOutlined />
                        {t("edit-this-board")}
                    </Button>
                </div>
                <div className="rounded bg-[url('/board-default4.jpg')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group">
                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">Hello</h1>
                    <Button className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditOutlined />
                        {t("edit-this-board")}
                    </Button>
                </div>

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
                <div className="rounded bg-[url('/board-default1.jpg')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group">
                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">Hello</h1>
                    <Button className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditOutlined />
                        {t("edit-this-board")}
                    </Button>
                </div>
                <div className="rounded bg-[url('/board-default2.jpg')] bg-cover bg-center w-[270px] h-[130px] relative overflow-hidden group">
                    <h1 className="absolute top-4 left-4 font-semibold stroke-neutral-500 shadow-gray-900 text-white text-shadow">Hello</h1>
                    <Button className="!bg-slate-800 !text-white !border-none absolute left-1/2 -translate-x-1/2 top-20 opacity-0 group-hover:opacity-100 transition-opacity" onClick={showModalEdit}>
                        <EditOutlined />
                        {t("edit-this-board")}
                    </Button>
                </div>
            </div>


            <ModalDashboard open={isModalOpen} isEditing={isEditing} onCancel={hanleModalCancel} onOk={hanleModalOk}></ModalDashboard>
            
        </div>
    );
};

export default DashboardHome;
