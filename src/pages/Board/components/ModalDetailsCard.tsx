import { useEffect, useRef, useState } from "react";
import { Modal, Button, Divider, Input, Typography } from "antd";
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
import useAppSelector from "../../../hooks/useAppSelector";
import { selectAllLists } from "../../../stores/slices/boardEntity/boardEntity.slice";

const { Text } = Typography;

interface PropsType {
    open: boolean;
    onCancel: () => void;
    task: TaskType | null;
}

const ModalDetailsCard = ({ open, onCancel, task }: PropsType) => {
    const { t } = useTranslation();
    const { notify, contextHolder } = useNotify();
    const dispatch = useAppDispatch();
    const tit = useAppSelector(selectAllLists).find((list) => list.id === task?.list_id)?.title;
    const [title, setTitle] = useState<string | undefined>(tit);
    
    const [localTitle, setLocalTitle] = useState<string>("");
    const [localStatus, setLocalStatus] = useState<boolean>(false);
    const [localDescription, setLocalDescription] = useState<string>("");
    const [localDueDate, setLocalDueDate] = useState<string | null>(null);

    useEffect(() => {
        setTitle(tit);
    }, [tit]);

    useEffect(() => {
        if (open && task) {
            setLocalTitle(task.title);
            setLocalStatus(task.status);
            setLocalDescription(task.description || "");
            setLocalDueDate(task.due_date);
        }
    }, [open, task]);

    const editorRef = useRef<TinyMCEEditor | null>(null);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isLabelDrawerOpen, setIsLabelDrawerOpen] = useState(false);
    const [isMoveCardModalOpen, setIsMoveCardModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

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
        setLocalStatus(!localStatus);
    };

    const handleSave = () => {
        if (!task) return;

        if (localTitle.trim() === "") {
            notify(false, t("title-cannot-be-empty"));
            return;
        }

        const description = editorRef.current?.getContent() || localDescription;

        const updates: Partial<TaskType> = {
            title: localTitle,
            status: localStatus,
            description: description,
            due_date: localDueDate,
        };

        dispatch(thunkUpdate({ location: "tasks", id: task.id, data: updates }));
        notify(true, t("saved-successfully"));
        onCancel();
    };

    const handleCancel = () => {
        if (task) {
            setLocalTitle(task.title);
            setLocalStatus(task.status);
            setLocalDescription(task.description || "");
            setLocalDueDate(task.due_date);
        }
        onCancel();
    };

    const handleDueDateChange = (dueDate: string | null) => {
        setLocalDueDate(dueDate);
    };

    if (!task) return null;

    return (
        <>
            {contextHolder}
            <Modal open={open} onCancel={handleCancel} footer={null} width={900} className="p-0">
                <div className="flex gap-6">
                    <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <Button
                                    shape="circle"
                                    color={localStatus ? "green" : "default"}
                                    variant={localStatus ? "solid" : "outlined"}
                                    icon={localStatus ? <CheckOutlined /> : null}
                                    onClick={handleTaskStatus}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <Input
                                        value={localTitle}
                                        onChange={(e) => setLocalTitle(e.target.value)}
                                        className="text-xl font-semibold border-0 focus:border-b focus:border-blue-500 px-0"
                                        placeholder={t("enter-card-title")}
                                    />
                                </div>

                                <div className="flex gap-2 mt-1">
                                    {t("in-list")}
                                    <Button
                                        size="small"
                                        className="!bg-slate-300 !text-black !font-semibold !flex !items-center"
                                        onClick={openMoveCardModal}
                                    >
                                        {title} <DownOutlined className="mt-1 text-[12px]" />
                                    </Button>
                                </div>

                                <div className="mt-5">
                                    <h4 className="font-semibold mb-2">{t("description")}</h4>

                                    <div className="border rounded-md" data-color-mode="light">
                                        <Editor
                                            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                            onInit={(_evt, editor) => (editorRef.current = editor)}
                                            key={task.id}
                                            initialValue={localDescription || "<p>Nhập mô tả tại đây</p>"}
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
                                        <Button type="primary" onClick={handleSave}>
                                            {t("save")}
                                        </Button>
                                        <Button type="text" onClick={handleCancel}>
                                            {t("cancel")}
                                        </Button>
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
                            <div>
                                <Button block type="default" className="!text-black" icon={<ClockCircleOutlined />} onClick={openDatePicker}>
                                    {t("dates")}
                                </Button>
                                {localDueDate && (
                                    <Text className="text-xs text-gray-500 block mt-1 ml-1">
                                        {new Date(localDueDate).toLocaleString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </Text>
                                )}
                            </div>
                            <Divider />
                            <Button block danger icon={<MinusOutlined />} onClick={openDelete}>
                                {t("delete")}
                            </Button>
                        </div>
                    </div>
                </div>

                <ModalDayPicker open={isDatePickerOpen} onClose={closeDatePicker} dueDate={localDueDate} onSave={handleDueDateChange} />
                <DrawerLabel open={isLabelDrawerOpen} onClose={closeLabelDrawer} />
                <ModalMoveCard open={isMoveCardModalOpen} task={task} onClose={closeMoveCardModal} setTitle={setTitle} />
                <ModalCloseBoard open={isModalDeleteOpen} onOk={() => handleDeleteTask(true)} onCancel={() => handleDeleteTask(false)} />
            </Modal>
        </>
    );
};

export default ModalDetailsCard;
