import React from "react";
import { Modal, Divider } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import type { TaskType } from "../../../types/board.type";
import { useTranslation } from "react-i18next";

interface Props {
    open: boolean;
    onClose: () => void;
    task: TaskType | null;
}

export const ModalInfoTask: React.FC<Props> = ({ open, onClose, task }) => {
    const { t } = useTranslation();

    if (!task) return null;

    return (
        <Modal open={open} onCancel={onClose} footer={null} width={700} title={task.title}>
            <div className="py-4">
                {task.due_date && (
                    <>
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <ClockCircleOutlined /> {t("due-date")}
                            </h4>
                            <p className="text-gray-700">
                                {new Date(task.due_date).toLocaleString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <Divider />
                    </>
                )}
                
                <h4 className="font-semibold mb-3">{t("description")}</h4>
                {task.description ? (
                    <div 
                        className="prose max-w-none border rounded-md p-4 bg-gray-50"
                        dangerouslySetInnerHTML={{ __html: task.description }}
                    />
                ) : (
                    <p className="text-gray-400 italic">{t("no-description")}</p>
                )}
            </div>
        </Modal>
    );
};
