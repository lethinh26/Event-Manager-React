import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Drawer, Button, Space, Input, Typography, TimePicker } from "antd";
import { DayPicker, type DateRange } from "react-day-picker";
import type { Dayjs } from "dayjs";

import "react-day-picker/style.css";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

type PropsType = {
    onClose: () => void;
    open: boolean;
};

const FORMAT = "HH:mm:ss";

const DrawerDayPicker: React.FC<PropsType> = ({ onClose, open }) => {
    const {t} = useTranslation();
    const [timeRange, setTimeRange] = React.useState<any>(null);
    const [range, setRange] = React.useState<DateRange | undefined>();

    return (
        <Drawer
            title={t('dates')}
            placement="right"
            onClose={onClose}
            open={open}
            width={320}
            footer={
                <Space direction="vertical" size={12} className="w-full">
                    <Button type="primary" block></Button>
                    <Button danger block>
                        {t('remove')}
                    </Button>
                </Space>
            }
        >
            <DayPicker mode="range" selected={range} onSelect={setRange} />

            <Space direction="vertical" className="w-full mt-5">
                <Text className="font-bold">{t('schedule')}</Text>

                <Space>
                    <Input
                        readOnly
                        style={{ width: 110 }}
                    />
                    <ArrowRightOutlined className="mx-1.5" />
                    <Input placeholder="DD/MM/YYYY" value={range?.to ? range.to.toLocaleDateString() : ""} readOnly style={{ width: 110 }} />
                </Space>

                <Text className="font-bold">{t('time')}</Text>
                <TimePicker.RangePicker format={FORMAT} showNow onChange={setTimeRange} />
            </Space>
        </Drawer>
    );
};

export default DrawerDayPicker;
