import { Button, ColorPicker, Form, Input, Modal, Radio, Space } from "antd";
import { useTranslation } from "react-i18next";
import UploadImage from "./UploadImage";
import { CheckOutlined } from "@ant-design/icons";

type PropsType = {
    open: boolean;
    isEditing: boolean;
    onCancel: () => void;
};

type FormValues = {
    background: string;
    color: string;
    title: string;
};

const ModalDashboard = ({ open, isEditing, onCancel }: PropsType) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const backgrounds = ["board-default1.jpg", "board-default2.jpg", "board-default3.jpg"];
    const colors = ["#FF8A00", "#E11D48", "#10B981", "#22D3EE", "#EAB308", "#8B5CF6"];

    const onFinish = (values: FormValues) => {
        console.log("Form values:", values);

        form.resetFields();
    };

    const selectedBg = Form.useWatch("background", form);
    const selectedColor = Form.useWatch("color", form);

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={520}
            title={
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{isEditing ? t("update-board") : t("create-board")}</span>
                </div>
            }
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Form.Item label={t("background")} name="background" rules={[{ required: true, message: t('please-select-a-background') }]}>
                        <Radio.Group>
                            <Space size="middle">
                                {backgrounds.map((src) => (
                                    <Radio.Button key={src} value={src} className="relative !w-[100px] !h-[100px] rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${src})` }} />
                                        {selectedBg === src && (
                                            <span className="absolute right-1 top-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 shadow">
                                                <CheckOutlined className="!text-slate-700 text-xs" />
                                            </span>
                                        )}
                                    </Radio.Button>
                                ))}
                                <UploadImage loading={false} />
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label={t("color")} name="color" rules={[{ required: true, message: t('please-select-a-color') }]}>
                        <Radio.Group>
                            <Space size="small">
                                {colors.map((hex) => (
                                    <Radio.Button key={hex} value={hex} className="relative !w-12 !h-9 rounded-md" style={{ backgroundColor: hex }}>
                                        {selectedColor === hex && (
                                            <span className="absolute right-1 top-1 inline-flex items-center justify-center w-5 h-4 rounded-full bg-white/95 shadow">
                                                <CheckOutlined className="!text-slate-700 text-xs" />
                                            </span>
                                        )}
                                    </Radio.Button>
                                ))}
                                <ColorPicker
                                    allowClear
                                    showText={false}
                                    mode={["single", "gradient"]}
                                    onChangeComplete={(color) => {
                                        console.log(color.toCssString());
                                    }}
                                />
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label={t("board-title")} name="title" rules={[{ required: true, message: t("please-provide-a-valid-board-title") }]}>
                        <Input placeholder="E.g. Shopping" className="h-11" />
                    </Form.Item>

                    <Space direction="horizontal" size="middle">
                        <Button danger onClick={onCancel}>
                            {t("close")}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {t("create")}
                        </Button>
                    </Space>
                </Space>
            </Form>
        </Modal>
    );
};

export default ModalDashboard;
