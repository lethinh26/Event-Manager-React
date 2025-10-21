import React, { useRef, useState } from "react";
import { Modal, Button, Select, Divider } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { ClockCircleOutlined, DownOutlined, MinusOutlined, TagOutlined } from "@ant-design/icons";
import ModalDayPicker from "./DrawerDayPicker";
import DrawerLabel from "./DrawerLabel";
// import { Day, DayPicker } from "react-day-picker";

import {} from "antd";
import ModalMoveCard from "./ModalMoveCard";
import useNotify from "../../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import ModalCloseBoard from "./ModalCloseBoard";

interface Props {
    open: boolean;
    onCancel: () => void;
}

const ModalDetailsCard: React.FC<Props> = ({ open, onCancel }) => {
    const { t } = useTranslation();
    const { notify } = useNotify();

    const editorRef = useRef<unknown>(null);

    // date picker
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const openDatePicker = (): void => {
        setIsDatePickerOpen(true);
    };

    const closeDatePicker = (): void => {
        setIsDatePickerOpen(false);
    };

    // label drawer
    const [isLabelDrawerOpen, setIsLabelDrawerOpen] = useState(false);
    const closeLabelDrawer = (): void => {
        setIsLabelDrawerOpen(false);
    };
    const openLabelDrawer = (): void => {
        setIsLabelDrawerOpen(true);
    };

    // move card
    const [isMoveCardModalOpen, setIsMoveCardModalOpen] = useState(false);
    const closeMoveCardModal = (): void => {
        setIsMoveCardModalOpen(false);
    };
    const openMoveCardModal = (): void => {
        setIsMoveCardModalOpen(true);
    };

    // delete
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const openDelete = () => setIsModalDeleteOpen(true);

    const handleOk = () => {
        setIsModalDeleteOpen(false);
        notify(true, t("deleted-successfully"));
    };

    const handleCancel = () => {
        setIsModalDeleteOpen(false);
    };

    return (
        <Modal open={open} onCancel={onCancel} footer={null} width={900} className="p-0">
            <div className="flex gap-6">
                <div className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                        <div className="mt-1">
                            <input type="radio" className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">Blabla</h3>
                                <Select defaultValue="inprogress" style={{ width: 140 }} size="small">
                                    <Select.Option value="todo">TODO</Select.Option>
                                    <Select.Option value="inprogress">IN-PROGRESS</Select.Option>
                                </Select>
                            </div>
                            <div className="flex gap-2 mt-1">
                                In list:
                                <Button color="default" variant="solid" size="small" className="!bg-slate-300 !text-black !font-semibold !flex !items-center" onClick={openMoveCardModal}>
                                    In-progress <DownOutlined className="mt-1 text-[12px]" />
                                </Button>
                            </div>

                            <div className="mt-5">
                                <h4 className="font-semibold mb-2">Description</h4>

                                <div className="border rounded-md" data-color-mode="light">
                                    <Editor
                                        apiKey="om0p47k28i4hd84f7ink542qqybtkah8ak46k0i5h1jpocjh"
                                        onInit={(_evt, editor) => (editorRef.current = editor)}
                                        initialValue="<p>This is the initial content of the editor.</p>"
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
                                                "undo redo | blocks | " +
                                                "bold italic forecolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist outdent indent | " +
                                                "removeformat | help",
                                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <Button type="primary">Save</Button>
                                    <Button type="text">Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-48 p-6">
                    <div className="space-y-3">
                        <Button block type="default" icon={<TagOutlined />} onClick={openLabelDrawer}>
                            Labels
                        </Button>
                        <Button block type="default" variant="solid" color="yellow" className="!text-black" icon={<ClockCircleOutlined />} onClick={openDatePicker}>
                            Dates
                        </Button>
                        <Divider size="small" />
                        <Button block variant="solid" color="danger" danger icon={<MinusOutlined />} onClick={openDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            <ModalDayPicker open={isDatePickerOpen} onClose={closeDatePicker} />
            <DrawerLabel open={isLabelDrawerOpen} onClose={closeLabelDrawer} />
            <ModalMoveCard open={isMoveCardModalOpen} onClose={closeMoveCardModal} />
            <ModalCloseBoard open={isModalDeleteOpen} onOk={handleOk} onCancel={handleCancel} />
        </Modal>
    );
};

export default ModalDetailsCard;
