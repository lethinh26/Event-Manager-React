import React, { useState, useEffect } from "react";
import { Modal, Select, Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import useAppSelector from "../../../hooks/useAppSelector";
import { selectAllLists, selectAllTasks } from "../../../stores/slices/boardEntity/boardEntity.slice";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { thunkUpdate } from "../../../stores/slices/boardEntity/boardEntity.thunk";
import type { TaskType } from "../../../types/board.type";
import useNotify from "../../../hooks/useNotify";

type PropsType = {
    open: boolean;
    onClose: () => void;
    task: TaskType | null;
};

const { Title, Text } = Typography;

const ModalMoveCard = ({ open, onClose, task }: PropsType) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { notify, contextHolder } = useNotify();
    const lists = useAppSelector(selectAllLists);
    const tasks = useAppSelector(selectAllTasks);    

    const [selectListId, setselectListId] = useState<string>("");
    const [selectedPosition, setSelectedPosition] = useState<number>(0);

    useEffect(() => {
        if (task) {            
            setselectListId(task.list_id);
            setSelectedPosition(task.position);
        }
    }, [task]);

    const listOptions = lists.map((list) => ({ label: list.title, value: list.id }));    
    const positionOptions = tasks.filter(list => list.list_id === selectListId).length > 0 ? tasks.filter(task => task.list_id === selectListId).map((task, i) => ({label: i+1, value: i})) : [{label: 1, value: 1}]

    const handleMove = async () => {
        if (!task) return;

        try {
            await dispatch(
                thunkUpdate({
                    location: "tasks",
                    id: task.id,
                    data: {
                        list_id: selectListId,
                        position: selectedPosition,
                    },
                })
            );

            notify(true, t("card-moved-successfully"));
            onClose();
        } catch {
            notify(false, t("failed-to-move-card"));
        }
    };

    return (
        <>
            {contextHolder}
            <Modal open={open} onCancel={onClose} footer={null} width={560} centered>
                <div>
                    <div className="flex items-center justify-between">
                        <Title level={4} className="!mb-0">
                            {t("move-card")}
                        </Title>
                    </div>

                    <div className="mt-3">
                        <Text className="!text-gray-400 font-semibold">{t("select-destination")}</Text>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("list")}</label>
                            <Select className="w-full" value={selectListId} onChange={setselectListId} options={listOptions} size="large" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("position")}</label>
                            <Select
                                className="w-full"
                                value={selectedPosition}
                                onChange={setSelectedPosition}
                                options={positionOptions}
                                size="large"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button type="primary" size="large" className="min-w-[110px]" onClick={handleMove}>
                            {t("move")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalMoveCard;
