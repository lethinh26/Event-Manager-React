import React, { useRef, useState } from "react";
import { Modal, Button, Divider } from "antd";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";
import { CheckOutlined, ClockCircleOutlined, DownOutlined, MinusOutlined, TagOutlined } from "@ant-design/icons";
import ModalDayPicker from "./DrawerDayPicker";
import DrawerLabel from "./DrawerLabel";
import ModalMoveCard from "./ModalMoveCard";
import useNotify from "../../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import ModalCloseBoard from "./ModalCloseBoard";
import type { TaskType } from "../../../types/board.type";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { thunkDelete, thunkUpdate } from "../../../stores/slices/boardEntity/boardEntity.thunk";

interface Props {
    open: boolean;
    onCancel: () => void;
    task: TaskType | null;
}

const ModalDetailsCard: React.FC<Props> = ({ open, onCancel, task }) => {
    const { t } = useTranslation();
    const { notify, contextHolder } = useNotify();
    const dispatch = useAppDispatch();

    const editorRef = useRef<TinyMCEEditor | null>(null);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isLabelDrawerOpen, setIsLabelDrawerOpen] = useState(false);
    const [isMoveCardModalOpen, setIsMoveCardModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [statusTask, setStatusTask] = useState(task?.status);

    const openDatePicker = () => setIsDatePickerOpen(true);
    const closeDatePicker = () => setIsDatePickerOpen(false);

    const openLabelDrawer = () => setIsLabelDrawerOpen(true);
    const closeLabelDrawer = () => setIsLabelDrawerOpen(false);

    const openMoveCardModal = () => setIsMoveCardModalOpen(true);
    const closeMoveCardModal = () => setIsMoveCardModalOpen(false);

    const openDelete = () => setIsModalDeleteOpen(true);
    
    const handleDeleteTask = async (success: boolean) => {
        setIsModalDeleteOpen(false);
        if (success && task) {
            try {
                await dispatch(thunkDelete({ location: "tasks", id: task.id }));
                notify(true, t("deleted-successfully"));
                onCancel();
            } catch {
                notify(false, t("failed"));
            }
        }
    };

    const handleTaskStatus = () => {
        if (task) {
            dispatch(thunkUpdate({ location: "tasks", id: task.id, data: { status: !task.status } }));
            setStatusTask(!statusTask);
        }
    };

    const handleSaveDes = () => {
        if (task && editorRef.current) {
            const description = editorRef.current.getContent();
            dispatch(thunkUpdate({ location: "tasks", id: task.id, data: { description } }));
            notify(true, t("saved-successfully"));
        }
        onCancel()
    };

    const handleCancelEdit = () => {
        onCancel();
    };

    if (!task) return null;

    return (
        <>
            {contextHolder}
            <Modal open={open} onCancel={onCancel} footer={null} width={900} className="p-0">
            <div className="flex gap-6">
                <div className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            <Button
                                shape="circle"
                                color={statusTask ? "green" : "default"}
                                variant={statusTask ? "solid" : "outlined"}
                                icon={statusTask ? <CheckOutlined /> : null}
                                onClick={handleTaskStatus}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">{task.title}</h3>
                            </div>

                            <div className="flex gap-2 mt-1">
                                {t("in-list")}
                                <Button
                                    size="small"
                                    className="!bg-slate-300 !text-black !font-semibold !flex !items-center"
                                    onClick={openMoveCardModal}
                                >
                                    In-progress <DownOutlined className="mt-1 text-[12px]" />
                                </Button>
                            </div>

                            <div className="mt-5">
                                <h4 className="font-semibold mb-2">{t("description")}</h4>

                                <div className="border rounded-md" data-color-mode="light">
                                    <Editor
                                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                        onInit={(_evt, editor) => (editorRef.current = editor)}
                                        initialValue={task.description || "<p>Nhập mô tả tại đây</p>"}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                "advlist",
                                                "autolink",
                                                "lists",
                                                "link",
                                                "image",
                                                "charmap",
                                                "preview",
                                                "anchor",
                                                "searchreplace",
                                                "visualblocks",
                                                "code",
                                                "fullscreen",
                                                "insertdatetime",
                                                "media",
                                                "table",
                                                "code",
                                                "help",
                                                "wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | blocks | image |" +
                                                "bold italic forecolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist outdent indent | " +
                                                "removeformat | help",
                                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <Button type="primary" onClick={handleSaveDes}>{t("save")}</Button>
                                    <Button type="text" onClick={handleCancelEdit}>{t("cancel")}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-48 p-6">
                    <div className="space-y-3">
                        <Button block type="default" icon={<TagOutlined />} onClick={openLabelDrawer}>
                            {t("labels")}
                        </Button>
                        <Button block type="default" className="!text-black" icon={<ClockCircleOutlined />} onClick={openDatePicker}>
                            {t("dates")}
                        </Button>
                        <Divider />
                        <Button block danger icon={<MinusOutlined />} onClick={openDelete}>
                            {t("delete")}
                        </Button>
                    </div>
                </div>
            </div>

            <ModalDayPicker open={isDatePickerOpen} onClose={closeDatePicker} />
            <DrawerLabel open={isLabelDrawerOpen} onClose={closeLabelDrawer} />
            <ModalMoveCard open={isMoveCardModalOpen} task={task} onClose={closeMoveCardModal} />
            <ModalCloseBoard open={isModalDeleteOpen} onOk={() => handleDeleteTask(true)} onCancel={() => handleDeleteTask(false)} />
            </Modal>
        </>
    );
};

export default ModalDetailsCard;
