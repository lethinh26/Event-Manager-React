import React from "react";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Drawer, Input, Checkbox, Select, Divider } from "antd";
import { useTranslation } from "react-i18next";

type PropsType = {
    open: boolean;
    onClose: () => void;
};

const FilterBoard: React.FC<PropsType> = ({ open, onClose }) => {
    const { t } = useTranslation();

    return (
        <Drawer title={t("filter")} placement="right" onClose={onClose} open={open} width={360}>
            <div className="space-y-4">
                <div>
                    <p className="font-bold">{t("keyword")}</p>
                    <Input className="mt-2" placeholder={t("enter-a-keyword")} />
                </div>

                <Divider />

                <div>
                    <p className="font-bold">{t("card-status")}</p>
                    <div className="mt-3 space-y-2">
                        <Checkbox>{t("marked-as-complete")}</Checkbox>
                        <Checkbox>{t("not-marked-as-complete")}</Checkbox>
                    </div>
                </div>

                <Divider />

                <div>
                    <p className="font-bold">{t('due-date')}</p>
                    <div className="mt-3 space-y-2 text-sm flex flex-col">
                        <Checkbox>
                            <CalendarOutlined className="mr-2" /> {t("no-dates")}
                        </Checkbox>
                        <Checkbox>
                            <ClockCircleOutlined style={{ color: "#ff4d4f" }} className="mr-2" /> {t("overdue")}
                        </Checkbox>
                        <Checkbox>
                            <ClockCircleOutlined style={{ color: "#faad14" }} className="mr-2" /> {t("due-in-the-next-day")}
                        </Checkbox>
                    </div>
                </div>

                <Divider />

                <div>
                    <p className="font-bold">{t('labels')}</p>
                    <div className="mt-3 space-y-2">
                        <Checkbox>{t("no-labels")}</Checkbox>

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
        </Drawer>
    );
};

export default FilterBoard;
