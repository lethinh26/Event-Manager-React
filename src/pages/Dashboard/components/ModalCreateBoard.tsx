import { Button, ColorPicker, Form, Input, Modal, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadImage from "./UploadImage";
import { CheckOutlined } from "@ant-design/icons";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import type { StoreType } from "../../../stores";
import { thunkPostBoard, thunkUpdateBoard } from "../../../stores/slices/board/board.thunk";
import type { AggregationColor } from "antd/es/color-picker/color";

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
    const user = useSelector((state: StoreType) => state.user.user);
    const board = useSelector((state: StoreType) => (editId ? state.board.boards?.find((b) => b.id === editId) : null));

    const { t } = useTranslation();
    const [form] = Form.useForm();
    const backgrounds = ["./src/assets/board-default1.jpg", "./src/assets/board-default2.jpg", "./src/assets/board-default3.jpg"];
    const colors = ["#FF8A00", "#E11D48", "#10B981", "#22D3EE", "#EAB308", "#8B5CF6"];

    const bgWatch = Form.useWatch("background", form);
    const colorWatch = Form.useWatch("color", form);

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    useEffect(() => {
        if (uploadedImage !== null) {
            form.setFieldsValue({ background: uploadedImage });
        }
        console.log(form);
    }, [uploadedImage, form]);

    useEffect(() => {
        if (editId && board) {
            form.setFieldsValue({
                title: board.title,
                background: board.backdrop,
                color: board.color,
            });

            if (!backgrounds.includes(board.backdrop)) {
                setUploadedImage(board.backdrop);
            }
        }
    }, [editId, board, form]);

    const onFinish = (values: FormValues) => {
        const board = {
            id: crypto.randomUUID(),
            user_id: user?.id || "",
            title: values.title,
            backdrop: values.background,
            color: values.color,
            is_starred: false,
            is_closed: false,
            created_at: new Date().toISOString(),
        };

        if (editId) {
            dispatch(thunkUpdateBoard({ boardId: editId, data: board }));
        } else {
            dispatch(thunkPostBoard(board));
        }

        form.resetFields();
        onOk();
    };

    const handleOnClose = () => {
        setUploadedImage(null);
        form.resetFields();
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
                    <Form.Item label={t("background")} name="background" rules={[{ required: true, message: t("please-select-a-background") }]}>
                        <Radio.Group>
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

                    <Form.Item label={t("color")} name="color" rules={[{ required: true, message: t("please-select-a-color") }]}>
                        <Radio.Group>
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
                                {/* <ColorPicker
                                    allowClear
                                    showText={false}
                                    mode={["single", "gradient"]}
                                    onChangeComplete={(color: AggregationColor) => {
                                        if (color.isGradient()) {

                                            console.log(color.getColors());
                                        }else {
                                            console.log(color.toHex());
                                        }
                                    }}
                                /> */}
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
