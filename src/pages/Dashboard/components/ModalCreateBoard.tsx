import { Button, Form, Input, Modal, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadImage from "./UploadImage";
import { CheckOutlined } from "@ant-design/icons";
import useAppDispatch from "../../../hooks/useAppDispatch";
import type { StoreType } from "../../../stores";
import useAppSelector from "../../../hooks/useAppSelector";
import { selectAllBoards } from "../../../stores/slices/boardEntity/boardEntity.slice";
import { thunkPost, thunkUpdate } from "../../../stores/slices/boardEntity/boardEntity.thunk";

type PropsType = {
    open: boolean;
    editId: string | null;
    onCancel: () => void;
    onOk: () => void;
};

type FormValues = {
    background: string;
    color: string;
    title: string;
};

const ModalCreateBoard = ({ open, editId, onCancel, onOk }: PropsType) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: StoreType) => state.user.user);
    const board = useAppSelector(selectAllBoards);
    const currentBoard = board.find((b) => b.id === editId);

    const { t } = useTranslation();
    const [form] = Form.useForm();

    const backgrounds  = ["./src/assets/board-default1.jpg", "./src/assets/board-default2.jpg", "./src/assets/board-default3.jpg"];
    const colors = ["#FF8A00", "#E11D48", "#10B981", "#22D3EE", "#EAB308", "#8B5CF6"];

    const bgWatch = Form.useWatch("background", form);
    const colorWatch = Form.useWatch("color", form);

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    useEffect(() => {
        if (uploadedImage !== null) {
            form.setFieldsValue({ background: uploadedImage });
        }
    }, [uploadedImage, form]);

    useEffect(() => {
        if (editId && currentBoard) {
            form.setFieldsValue({
                title: currentBoard.title,
                background: currentBoard.backdrop,
                color: currentBoard.color,
            });

            if (currentBoard.backdrop && !backgrounds.includes(currentBoard.backdrop)) {
                setUploadedImage(currentBoard.backdrop);
            }
        }
    }, [editId, board, form]);

    useEffect(() => {
        if (!form.getFieldValue("background") && !form.getFieldValue("color")) {
            form.setFieldsValue({ background: backgrounds[0] });
        }
    }, [form]);

    const onFinish = (values: FormValues) => {
        const newBoard = {
            id: crypto.randomUUID(),
            user_id: user?.id || "",
            title: values.title,
            backdrop: values.background || null, 
            color: values.background ? null : values.color,
            is_starred: false,
            is_closed: false,
            created_at: new Date().toISOString(),
        };

        if (editId) {            
            dispatch(thunkUpdate({ location: "boards", id: editId, data: newBoard }));
        } else {
            dispatch(thunkPost({ location: "boards", data: newBoard }));
        }

        form.resetFields();
        onOk();
    };

    const handleOnClose = () => {
        setUploadedImage(null);
        form.resetFields();
    };

    const handleBackgroundChange = (value: string) => {
        if (value) {
            form.resetFields(["color"]);
        }
    };

    const handleColorChange = (value: string) => {
        if (value) {
            form.resetFields(["background"]);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={() => {
                handleOnClose();
                onCancel();
            }}
            footer={null}
            width={520}
            onOk={() => {
                handleOnClose();
                onOk();
            }}
            title={
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{editId ? t("update-board") : t("create-board")}</span>
                </div>
            }
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Form.Item
                        label={t("background")}
                        name="background"
                    >
                        <Radio.Group onChange={(e) => handleBackgroundChange(e.target.value)}>
                            <Space size="middle">
                                {backgrounds.map((src) => (
                                    <Radio.Button key={src} value={src} className="relative !w-[100px] !h-[100px] rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${src})` }} />
                                        {bgWatch === src && (
                                            <span className="absolute right-1 top-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 shadow">
                                                <CheckOutlined className="!text-slate-700 text-xs" />
                                            </span>
                                        )}
                                    </Radio.Button>
                                ))}
                                <Radio.Button value={uploadedImage} className="!w-[100px] !h-[100px] rounded-lg overflow-hidden !p-0">
                                    <UploadImage imageUrl={uploadedImage} setUrlImage={setUploadedImage} />
                                    {bgWatch === uploadedImage && (
                                        <span className="absolute right-1 top-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 shadow">
                                            <CheckOutlined className="!text-slate-700 text-xs" />
                                        </span>
                                    )}
                                </Radio.Button>
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label={t("color")}
                        name="color"
                    >
                        <Radio.Group onChange={(e) => handleColorChange(e.target.value)}>
                            <Space size="small">
                                {colors.map((hex) => (
                                    <Radio.Button key={hex} value={hex} className="relative !w-12 !h-9 rounded-md" style={{ backgroundColor: hex }}>
                                        {colorWatch === hex && (
                                            <span className="absolute right-1 top-1 inline-flex items-center justify-center w-5 h-4 rounded-full bg-white/95 shadow">
                                                <CheckOutlined className="!text-slate-700 text-xs" />
                                            </span>
                                        )}
                                    </Radio.Button>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label={t("board-title")} name="title" rules={[{ required: true, message: t("please-provide-a-valid-board-title") }]}>
                        <Input placeholder="E.g. Shopping" className="h-11" />
                    </Form.Item>

                    <Space direction="horizontal" size="middle">
                        <Button
                            danger
                            onClick={() => {
                                handleOnClose();
                                onCancel();
                            }}
                        >
                            {t("close")}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editId ? t("update") : t("create")}
                        </Button>
                    </Space>
                </Space>
            </Form>
        </Modal>
    );
};

export default ModalCreateBoard;
