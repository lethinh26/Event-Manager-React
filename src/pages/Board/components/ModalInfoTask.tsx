import React from "react";
import { Modal } from "antd";
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
