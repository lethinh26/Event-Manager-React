import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Drawer, Input, Checkbox, Select, Divider, Button, Form, Radio } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";
import type { FilterType } from "../BoardMain";

type PropsType = {
    open: boolean;
    onClose: () => void;
    onOk: (value: FilterType) => void;
};

const FilterBoard = ({ open, onClose, onOk}: PropsType) => {
    const { t } = useTranslation();
    const [ form ] = useForm();

    const onFinish = (values: FilterType) => {
        const processedValues: FilterType = {
            ...values,
            status: typeof values.status === 'string' 
                ? (values.status === "true" ? true : values.status === "false" ? false : undefined)
                : values.status,
        };
        onOk(processedValues);
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log(errorInfo);
    };

    const handleReset = () => {
        form.resetFields();
        onOk({});
    };

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <span>{t("filter")}</span>
                    <Button size="small" onClick={handleReset}>
                        {t("reset")}
                    </Button>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={360}
            footer={
                <Button variant="solid" color="primary" className="!w-full" htmlType="submit" form="filterBoard">
                    {t("apply")}
                </Button>
            }
        >
            <Form form={form} onFinish={onFinish} id="filterBoard" onFinishFailed={onFinishFailed}>
                <div className="space-y-4">
                    <div>
                        <p className="font-bold">{t("keyword")}</p>
                        <Form.Item name="search">
                            <Input className="mt-2" placeholder={t("enter-a-keyword")} />
                        </Form.Item>
                    </div>

                    <Divider />

                    <div>
                        <p className="font-bold">{t("card-status")}</p>
                        <div className="mt-3 space-y-2">
                            <Form.Item name="status">
                                <Radio.Group>
                                    <Radio value="true">{t("marked-as-complete")}</Radio>
                                    <Radio value="false">{t("not-marked-as-complete")}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </div>

                    <Divider />

                    <div>
                        <p className="font-bold">{t("due-date")}</p>
                        <div className="mt-3 space-y-2 text-sm flex flex-col">
                            <Form.Item name="date">
                                <Radio.Group>
                                    <Radio value="notDate">
                                        <CalendarOutlined className="mr-2" /> {t("no-dates")}
                                    </Radio>
                                    <Radio value="overDate">
                                        <ClockCircleOutlined style={{ color: "#ff4d4f" }} className="mr-2" /> {t("overdue")}
                                    </Radio>
                                    <Radio value="dueTmrDate">
                                        <ClockCircleOutlined style={{ color: "#faad14" }} className="mr-2" /> {t("due-in-the-next-day")}
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </div>

                    <Divider />

                    <div>
                        <p className="font-bold">{t("labels")}</p>
                        <div className="mt-3 space-y-2">
                            <Form.Item name="notDate" valuePropName="checked" className="!m-0">
                                <Checkbox>{t("no-labels")}</Checkbox>
                            </Form.Item>

                            {/* render */}
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="flex items-center gap-3">
                                    <Checkbox />
                                    <span className="flex-1 h-6 bg-green-400 rounded" />
                                </label>

                                <label className="flex items-center gap-3">
                                    <Checkbox />
                                    <span className="flex-1 h-6 bg-yellow-400 rounded" />
                                </label>

                                <label className="flex items-center gap-3">
                                    <Checkbox />
                                    <span className="flex-1 h-6 bg-orange-400 rounded" />
                                </label>
                            </div>

                            <Select placeholder={t("select-labels")} className="w-full mt-2" />
                        </div>
                    </div>
                </div>
            </Form>
        </Drawer>
    );
};

export default FilterBoard;
