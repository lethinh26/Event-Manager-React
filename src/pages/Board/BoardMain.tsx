import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Input, Radio, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import {
    EllipsisOutlined,
    PlusOutlined,
    FilterOutlined,
    StarOutlined,
    NumberOutlined,
    TableOutlined,
    StarFilled,
    CheckOutlined,
    InfoCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import useNotify from "../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import ModalCloseBoard from "./components/ModalCloseBoard";
import FilterBoard from "./components/FilterBoard";
import ModalDetailsCard from "./components/ModalDetailsCard";
import { ModalInfoTask } from "./components/ModalInfoTask";
import { useNavigate, useParams } from "react-router";
import { useBoard } from "../../hooks/useBoard";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAllLists, selectAllTasks } from "../../stores/slices/boardEntity/boardEntity.slice";
import type { ListType, TaskType } from "../../types/board.type";
import useAppDispatch from "../../hooks/useAppDispatch";
import { thunkDelete, thunkGet, thunkPost, thunkUpdate } from "../../stores/slices/boardEntity/boardEntity.thunk";

const { Title, Text } = Typography;

const BoardMain: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const board = useBoard();
    const lists: ListType[] = useAppSelector(selectAllLists);
    const tasks: TaskType[] = useAppSelector(selectAllTasks);
    const isLoading = useAppSelector((state) => state.boardEntity.loading);

    const [isStar, setIsStar] = useState<boolean>(false);
    const [isModalCloseOpen, setIsModalCloseOpen] = useState<boolean>(false);
    const [isModalDeleteListOpen, setIsModalDeleteListOpen] = useState<boolean>(false);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [isEditCardOpen, setIsEditCardOpen] = useState<boolean>(false);
    const [isInfoTaskOpen, setIsInfoTaskOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [editTitle, setEditTitle] = useState<string | null>(null);
    const [editCardId, setEditCardId] = useState<string | null>(null);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [createList, setCreateList] = useState<{ isShow: boolean; data: string }>({ isShow: false, data: "" });
    const [createTask, setCreateTask] = useState<{ listId: string | null; title: string }>({ listId: null, title: "" });

    const { notify, contextHolder } = useNotify();
    const { t } = useTranslation();

    const menu: MenuProps = {
        items: [
            { key: "1", label: t("edit") },
            { key: "2", label: t("close") },
        ],
    };

    const toggleStar = () => {
        setIsStar((prev) => !prev);
        dispatch(
            thunkUpdate({
                location: "boards",
                id: id!,
                data: { is_starred: !isStar },
            })
        );
    };

    const handleModalClose = async (success: boolean) => {
        if (success && currentBoard) {
            try {
                await dispatch(thunkUpdate({ location: "boards", id: currentBoard.id, data: { is_closed: true } }));
                notify(true, t("board-closed-successfully"));
                setTimeout(() => navigate("/dashboard"), 1000);
            } catch {
                notify(false, t("failed-to-close-board"));
            }
        }
        setIsModalCloseOpen(false);
    };

    const handleModalDeleteList = (success: boolean) => {
        if (success && selectedListId) {
            const tasksInList = tasks.filter((t) => t.list_id === selectedListId);
            tasksInList.forEach((task) => {
                dispatch(thunkDelete({ location: "tasks", id: task.id }));
            });
            dispatch(thunkDelete({ location: "lists", id: selectedListId }));
            notify(true, t("list-deleted-successfully"));
            setSelectedListId(null);
        }
        setIsModalDeleteListOpen(false);
    };

    const handleEditTitle = (id: string) => setEditTitle(id);

    const handleEditCard = (taskId: string) => setEditCardId(taskId);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, listId: string) => {
        const newTitle = e.target.value;
        dispatch(thunkUpdate({ location: "lists", id: listId, data: { title: newTitle } }));
    };

    const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
        const newTitle = e.target.value;
        dispatch(thunkUpdate({ location: "tasks", id: taskId, data: { title: newTitle } }));
    };

    const handleAddList = () => {
        if (!createList.data.trim()) return;

        const data: ListType = {
            id: crypto.randomUUID(),
            board_id: id!,
            title: createList.data,
            created_at: new Date().toISOString(),
        };

        dispatch(thunkPost({ location: "lists", data }));
        setCreateList({ isShow: false, data: "" });
    };

    const handleAddTask = (listId: string) => {
        if (!createTask.title.trim()) return;

        const data: TaskType = {
            id: crypto.randomUUID(),
            list_id: listId,
            title: createTask.title,
            description: "",
            status: false,
            position: tasks.filter((t) => t.list_id === listId).length,
            due_date: null,
            created_at: new Date().toISOString(),
        };

        dispatch(thunkPost({ location: "tasks", data }));
        setCreateTask({ listId: null, title: "" });
    };

    const handleTaskStatus = (task: TaskType) => {
        dispatch(thunkUpdate({ location: "tasks", id: task.id, data: { status: !task.status } }));
    };

    const handleDeleteList = (listId: string) => {
        setSelectedListId(listId);
        setIsModalDeleteListOpen(true);
    };

    const handleOpenInfoTask = (task: TaskType) => {
        setSelectedTask(task);
        setIsInfoTaskOpen(true);
    };

    useEffect(() => {
        if (id) {
            dispatch(thunkGet({ location: "lists", idLocation: "board_id", id }));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (lists.length > 0) {
            lists.forEach((list) => {
                dispatch(thunkGet({ location: "tasks", idLocation: "list_id", id: list.id }));
            });
        }
    }, [lists.length, dispatch]);

    useEffect(() => {
        if (tasks.length > 0) {
            tasks.forEach((task) => {
                dispatch(thunkGet({ location: "tags", idLocation: "task_id", id: task.id }));
            });
        }
    }, [tasks.length, dispatch]);

    useEffect(() => {
        if (!id) {
            navigate("/dashboard");
        }
    }, [id, navigate]);

    const currentBoard = board?.find((b) => b.id === id);
    const currentList: ListType[] = lists.filter((list) => list.board_id === id);

    useEffect(() => {
        if (currentBoard) {
            setIsStar(currentBoard.is_starred);
        }
    }, [currentBoard]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!id || !currentBoard) {
        return null;
    }

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
                                onClick={toggleStar}
                            />

                            <Title level={4} className="!m-0">
                                {currentBoard?.title}
                            </Title>

                            <Space size={8} className="ml-2">
                                <Radio.Group size="small" defaultValue="list">
                                    <Radio.Button value="list">
                                        <NumberOutlined /> {t("boar")}
                                    </Radio.Button>
                                    <Radio.Button value="table">
                                        <TableOutlined /> {t("table")}
                                    </Radio.Button>
                                </Radio.Group>
                                <Button size="small" danger onClick={() => setIsModalCloseOpen(true)}>
                                    {t("close-this-board")}
                                </Button>
                            </Space>
                        </div>

                        <Button icon={<FilterOutlined />} size="small" onClick={() => setIsFilterOpen(true)}>
                            {t("filter")}
                        </Button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6">
                        {currentList?.map((list) => (
                            <div key={list.id} className="w-72 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-sm p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Text strong onDoubleClick={() => handleEditTitle(list.id)}>
                                            {editTitle === list.id ? (
                                                <Input
                                                    value={list.title}
                                                    onChange={(e) => handleTitleChange(e, list.id)}
                                                    onBlur={() => setEditTitle(null)}
                                                />
                                            ) : (
                                                list.title
                                            )}
                                        </Text>
                                        <Dropdown menu={menu} trigger={["click"]}>
                                            <Button type="text" size="small" icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    </div>

                                    <div className="space-y-3">
                                        {tasks
                                            .filter((task) => task.list_id === list.id)
                                            .sort((a, b) => a.position - b.position)
                                            .map((task) => (
                                                <Card key={task.id} size="small" className="rounded-md">
                                                    <div className="flex items-center gap-2 justify-between group">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                shape="circle"
                                                                color={task.status ? "green" : "default"}
                                                                variant={task.status ? "solid" : "outlined"}
                                                                icon={task.status ? <CheckOutlined /> : null}
                                                                onClick={() => handleTaskStatus(task)}
                                                            />
                                                            <div onDoubleClick={() => handleEditCard(task.id)}>
                                                                {editCardId === task.id ? (
                                                                    <Input
                                                                        defaultValue={task.title}
                                                                        onChange={(e) => handleTaskTitleChange(e, task.id)}
                                                                        onBlur={() => setEditCardId(null)}
                                                                        autoFocus
                                                                    />
                                                                ) : (
                                                                    <Text ellipsis={{ tooltip: true }} style={{ width: 150 }}>
                                                                        {task.title}
                                                                    </Text>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <InfoCircleOutlined
                                                                className="!text-blue-500 text-[16px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                onClick={() => handleOpenInfoTask(task)}
                                                            />
                                                            <EditOutlined
                                                                className="!text-amber-500 text-[16px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                onClick={() => {
                                                                    setSelectedTask(task);
                                                                    setIsEditCardOpen(true);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}

                                        {createTask.listId === list.id ? (
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder={t("enter-card-title")}
                                                    value={createTask.title}
                                                    onChange={(e) => setCreateTask({ ...createTask, title: e.target.value })}
                                                    onPressEnter={() => handleAddTask(list.id)}
                                                    autoFocus
                                                />
                                                <Space>
                                                    <Button size="small" type="primary" onClick={() => handleAddTask(list.id)}>
                                                        {t("add-card")}
                                                    </Button>
                                                    <CloseOutlined
                                                        className="cursor-pointer"
                                                        onClick={() => setCreateTask({ listId: null, title: "" })}
                                                    />
                                                </Space>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between">
                                                <Button
                                                    type="text"
                                                    className="text-left text-gray-500"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => setCreateTask({ listId: list.id, title: "" })}
                                                >
                                                    {t("add-a-card")}
                                                </Button>
                                                <DeleteOutlined
                                                    className="!text-red-500 mr-2 cursor-pointer"
                                                    onClick={() => handleDeleteList(list.id)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="w-72 h-fit">
                            <div className="bg-gray-200 rounded-lg flex items-center p-3 justify-center h-fit">
                                {createList.isShow && (
                                    <Space direction="vertical">
                                        <Input
                                            value={createList.data}
                                            placeholder={t("name-new-list")}
                                            onChange={(e) => setCreateList({ ...createList, data: e.target.value })}
                                        />

                                        <Space direction="horizontal">
                                            <Button color="primary" variant="solid" onClick={handleAddList}>
                                                {t("add-list")}
                                            </Button>
                                            <CloseOutlined
                                                className="cursor-pointer"
                                                onClick={() => setCreateList({ ...createList, isShow: false })}
                                            />
                                        </Space>
                                    </Space>
                                )}
                                {!createList.isShow && (
                                    <Button type="text" onClick={() => setCreateList({ ...createList, isShow: !createList.isShow })}>
                                        <Space direction="horizontal">
                                            <PlusOutlined />
                                            {t("add-another-list")}
                                        </Space>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalCloseBoard open={isModalCloseOpen} onCancel={() => handleModalClose(false)} onOk={() => handleModalClose(true)} />
            <ModalCloseBoard open={isModalDeleteListOpen} onCancel={() => handleModalDeleteList(false)} onOk={() => handleModalDeleteList(true)} />
            <FilterBoard open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
            <ModalDetailsCard open={isEditCardOpen} task={selectedTask} onCancel={() => setIsEditCardOpen(false)} />
            <ModalInfoTask open={isInfoTaskOpen} task={selectedTask} onClose={() => setIsInfoTaskOpen(false)} />
        </>
    );
};

export default BoardMain;
