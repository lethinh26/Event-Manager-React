import React, { useEffect } from "react";
import { Drawer, Button, Space, Input, Typography, TimePicker } from "antd";
import { DayPicker } from "react-day-picker";
import dayjs, { type Dayjs } from "dayjs";

import "react-day-picker/style.css";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

type PropsType = {
    onClose: () => void;
    open: boolean;
    dueDate: string | null;
    onSave: (dueDate: string | null) => void;
};

const FORMAT = "HH:mm:ss";

const DrawerDayPicker: React.FC<PropsType> = ({ onClose, open, dueDate, onSave }) => {
    const { t } = useTranslation();
    
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(null);

    useEffect(() => {
        if (open && dueDate) {
            const date = new Date(dueDate);
            setSelectedDate(date);
            setSelectedTime(dayjs(dueDate));
        } else if (open && !dueDate) {
            setSelectedDate(undefined);
            setSelectedTime(null);
        }
    }, [open, dueDate]);

    const handleSave = () => {
        if (!selectedDate) {
            onSave(null);
            onClose();
            return;
        }

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();
        
        const hour = selectedTime ? selectedTime.hour() : 0;
        const minute = selectedTime ? selectedTime.minute() : 0;
        const second = selectedTime ? selectedTime.second() : 0;

        const dueDateObj = new Date(year, month, day, hour, minute, second);
        const dueDateISO = dueDateObj.toISOString();

        onSave(dueDateISO);
        onClose();
    };

    const handleRemove = () => {
        setSelectedDate(undefined);
        setSelectedTime(null);
        onSave(null);
        onClose();
    };

    return (
        <Drawer
            title={t("dates")}
            placement="right"
            onClose={onClose}
            open={open}
            width={320}
            footer={
                <Space direction="vertical" size={12} className="w-full">
                    <Button type="primary" block onClick={handleSave}>
                        {t("save")}
                    </Button>
                    <Button danger block onClick={handleRemove}>
                        {t("remove")}
                    </Button>
                </Space>
            }
        >
            <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} />

            <Space direction="vertical" className="w-full mt-5">
                <Text className="font-bold">{t("selected-date")}</Text>

                <Input
                    readOnly
                    value={selectedDate ? selectedDate.toLocaleDateString("vi-VN") : ""}
                    placeholder="DD/MM/YYYY"
                    style={{ width: "100%" }}
                />

                <Text className="font-bold">{t("time")}</Text>
                <TimePicker 
                    format={FORMAT} 
                    showNow 
                    value={selectedTime}
                    onChange={setSelectedTime}
                    style={{ width: "100%" }}
                />
            </Space>
        </Drawer>
    );
};

export default DrawerDayPicker;
