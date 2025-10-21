import React, { useState } from "react";
import { Button, Card, Dropdown, Input, Menu, Radio, Space, Typography } from "antd";
import { EllipsisOutlined, PlusOutlined, FilterOutlined, StarOutlined, NumberOutlined, TableOutlined, StarFilled, CheckOutlined, InfoCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useNotify from "../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import ModalCloseBoard from "./components/ModalCloseBoard";
import FilterBoard from "./components/FilterBoard";
import ModalDetailsCard from "./components/ModalDetailsCard";

//NOTE: chưa làm handleTitleChange, handleItemCardChange
const { Title, Text } = Typography;

const BoardMain: React.FC = () => {
    const [isStar, setIsStar] = useState(false);
    //modal
    const [isModalCloseOpen, setIsModalCloseOpen] = useState(false);
    const { notify, contextHolder } = useNotify();
    const { t } = useTranslation();

    //close 
    const openClose = () => setIsModalCloseOpen(true);

    const handleOk = () => {
        setIsModalCloseOpen(false);
        notify(true, t("deleted-successfully"));
    };

    const handleCancel = () => {
        setIsModalCloseOpen(false);
    };

    //filter
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

    //edit card modal

    const [isEditCardOpen, setIsEditCardOpen] = useState(false);

    const openEditCard = () => setIsEditCardOpen(true);
    const closeEditCard = () => setIsEditCardOpen(false);

    //edit
    const [editTitle, setEditTitle] = useState<string | null>(null);
    const [editCardName, setEditCardName] = useState<number | null>(null);

    const handleEditTitle = (id: string) => {
        setEditTitle(id);
    };

    const handleEditCard = (id: number) => {
        setEditCardName(id);
    };

    //

    //
    const lists = [
        {
            id: "todo",
            title: "Todo",
            cards: [
                { name: "Thuê DJ", status: false },
                { name: "Lên kịch bản chương trình", status: false },
                { name: "Chuẩn bị kịch", status: true },
                { name: "Kịch bản", status: true },
                { name: "Thuê MC", status: false },
            ],
        },
        { id: "inprogress", title: "In-progress", cards: [] },
    ];

    const menu = (
        <Menu>
            <Menu.Item key="1">{t("edit")}</Menu.Item>
            <Menu.Item key="2">{t("close")}</Menu.Item>
        </Menu>
    );

    return (
        <>
            {contextHolder}
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-full mx-auto">
                    <div className="flex items-center justify-between mb-6 m-[-48px] bg-gray-200 p-5">
                        <div className="flex items-center gap-4">
                            <Button
                                size="middle"
                                icon={isStar ? <StarFilled className="!text-amber-400 !text-[20px]" /> : <StarOutlined className="!text-[20px]" />}
                                onClick={() => setIsStar(!isStar)}
                            ></Button>

                            <Title level={4} className="!m-0">
                                Tổ chức sự kiện Year-end party !
                            </Title>

                            <Space size={8} className="ml-2">
                                <Radio.Group size="small">
                                    <Radio.Button value="list" defaultChecked>
                                        {" "}
                                        <NumberOutlined /> {t("boar")}{" "}
                                    </Radio.Button>
                                    <Radio.Button value="table">
                                        {" "}
                                        <TableOutlined /> {t("table")}{" "}
                                    </Radio.Button>
                                </Radio.Group>
                                <Button size="small" danger onClick={openClose}>
                                    {t("close-this-board")}
                                </Button>
                            </Space>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button icon={<FilterOutlined />} size="small" onClick={openFilter}>
                                {t("filter")}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6">
                        {lists.map((list) => (
                            <div key={list.id} className="w-72 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-sm p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Text strong onDoubleClick={() => handleEditTitle(list.id)}>
                                            {editTitle === list.id ? <Input value={list.title} onChange={(e) => handleTitleChange(e, list.id)} onBlur={() => setEditTitle(null)} /> : list.title}
                                        </Text>
                                        <Dropdown overlay={menu} trigger={["click"]}>
                                            <Button type="text" size="small" icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    </div>

                                    <div className="space-y-3">
                                        {list.cards.map((c, idx) => (
                                            <Card key={idx} size="small" className="rounded-md">
                                                <div className="flex items-center gap-2 justify-between group">
                                                    <div className="flex items-center gap-2">
                                                        {c.status ? (
                                                            <Button shape="circle" color="green" variant="solid" icon={<CheckOutlined />}></Button>
                                                        ) : (
                                                            // <Checkbox checked={c.status} onChange={() => handleCheckboxChange(idx)}></Checkbox>
                                                            // <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                                            // <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs"></div>
                                                            <Button shape="circle" color="default" variant="outlined"></Button>
                                                        )}
                                                        <div onDoubleClick={() => handleEditCard(idx)}>
                                                            {editCardName === idx ? (
                                                                <Input value={c.name} onChange={(e) => handleCardNameChange(e, idx)} onBlur={() => setEditCardName(null)} />
                                                            ) : (
                                                                <Text ellipsis={{ tooltip: true }} style={{width: 150}}>{c.name}</Text>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 ">
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                            <InfoCircleOutlined className="!text-blue-500 text-[16px] font-bold"/>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                            <EditOutlined className="!text-amber-500 text-[16px] font-bold" onClick={() => setIsEditCardOpen(true)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                        <div className="flex justify-between">
                                            <Button type="text" className="text-left text-gray-500" icon={<PlusOutlined />}>
                                                {t("add-a-card")}
                                            </Button>
                                            <DeleteOutlined className="!text-red-500 mr-2" onClick={openClose}/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="w-72 flex-shrink-0 ">
                            <div className="bg-gray-200 rounded-lg h-16 flex items-center px-3 justify-center">
                                <Button type="text" icon={<PlusOutlined />}>
                                    {t("add-another-list")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalCloseBoard open={isModalCloseOpen} onCancel={handleCancel} onOk={handleOk} />
            <FilterBoard open={isFilterOpen} onClose={closeFilter} />
            <ModalDetailsCard open={isEditCardOpen} onCancel={closeEditCard} />
        </>
    );
};

export default BoardMain;
