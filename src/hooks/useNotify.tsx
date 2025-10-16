import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import React from "react";

const useNotify = () => {
    const [api, contextHolder] = notification.useNotification();
    const notify = (status: boolean, description: string) => {
        api.info({
            message: <span className={status ? "text-green-400 font-bold" : "text-red-500 font-bold"}>{status ? "Thành công" : "Thất bại"}</span>,
            description,
            placement: "topRight",
            icon: status ? <CheckCircleOutlined className="!text-green-400" /> : <CloseCircleOutlined className="!text-red-500 text-xl" />,
        });
    };
    return { notify, contextHolder };
};

export default useNotify;
