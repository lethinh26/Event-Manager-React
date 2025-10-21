import { ArrowRightOutlined } from "@ant-design/icons";
import { Drawer, Button, Space, Input, Typography, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import type { RangeValue } from 'rc-picker/lib/interface';
import dayjs, { Dayjs } from 'dayjs';

const { Text } = Typography;

import "react-day-picker/style.css";
const { RangePicker } = TimePicker;

type PropsType = {
    onClose: () => void;
    open: boolean;
};

const format = "HH:mm:ss";

const ModalDayPicker = ({ onClose, open }: PropsType) => {
    //time
    const [timeRange, setTimeRange] = useState<RangeValue<Dayjs>>(null);
    

    //date
    const [range, setRange] = useState<DateRange | undefined>();
    const [startDate, setStartDate] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");

    // useEffect(() => {
    //     console.log(range?.from?.toLocaleDateString());
    //     console.log(range?.to?.toLocaleDateString());
    // }, [range]);

    useEffect(() => {
        console.log(timeRange);
    }, [timeRange]);

    const footer = () => {
        return (
            <Space direction="vertical" size={12} className="w-full">
                <Button type="primary" className="w-full">
                    Save
                </Button>
                <Button danger className="w-full">
                    Remove
                </Button>
            </Space>
        );
    };
    return (
        <Drawer title="Dates" placement="right" onClose={onClose} open={open} width={320} footer={footer()}>
            <DayPicker mode="range" selected={range} onSelect={setRange} />
            <Space direction="vertical" className="w-full mt-5">
                <Text className="font-bold">Schedule</Text>

                <Space direction="horizontal">
                    <Input placeholder="DD/MM/YYYY" value={range?.from?.toLocaleDateString()} onChange={(e) => setStartDate(e.target.value)} style={{ width: "110px" }} />
                    <ArrowRightOutlined className="mx-1.5"/>
                    <Input placeholder="DD/MM/YYYY" value={range?.to?.toLocaleDateString()} onChange={(e) => setDueDate(e.target.value)} style={{ width: "110px" }} />
                </Space>

                <Text className="font-bold">Time</Text>
                <TimePicker.RangePicker format={format} showNow={true} onChange={(e)=>setTimeRange(e)}/>
            </Space>

        </Drawer>
    );
};

export default ModalDayPicker;
