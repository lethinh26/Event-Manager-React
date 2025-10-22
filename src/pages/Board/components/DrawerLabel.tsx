import React, { useState } from "react";
import { Drawer, Checkbox, Button, Typography, Modal, Input, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

type PropsType = {
    onClose: () => void;
    open: boolean;
};

const DrawerLabel: React.FC<PropsType> = ({ onClose, open }) => {
    const {t} = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const labels = [
        { name: "done", color: "bg-green-500" },
        { name: "urgent", color: "bg-orange-500" },
        { name: "todo", color: "bg-red-500" },
        { name: "in-progress", color: "bg-purple-500" },
    ];

    const colors = ["bg-emerald-200", "bg-amber-200", "bg-rose-200", "bg-red-200", "bg-violet-200", "bg-emerald-400", "bg-yellow-400", "bg-orange-400", "bg-rose-500", "bg-violet-500"];

    return (
        <>
            <Drawer title={t('labels')} open={open} onClose={onClose} width={380}>
                <div className="space-y-3 my-5">
                    {labels.map((l, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <Checkbox />
                            <div className={`flex-1 flex items-center justify-between rounded px-4 py-2 shadow-sm text-slate-700 font-semibold ${l.color}`}>
                                <span className="lowercase">{l.name}</span>
                            </div>
                            <button type="button" className="inline-flex items-center opacity-80 hover:opacity-100">
                                <EditOutlined />
                            </button>
                        </div>
                    ))}
                </div>

                <Button block size="large" type="text" className="rounded-xl !bg-slate-300 font-semibold h-12" onClick={() => setModalOpen(true)}>
                    {t('create-a-new-label')}
                </Button>
            </Drawer>

            <Modal title={t('create-label')} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={420} centered>
                <div className="space-y-4">
                    <div>
                        <Text className="text-slate-600">{t('title')}</Text>
                        <Input placeholder="" className="mt-1 rounded-lg" />
                    </div>

                    <div>
                        <Text className="text-slate-600">{t('select-a-color')}</Text>
                        <div className="mt-3 grid grid-cols-5 gap-3">
                            {colors.map((c, i) => {
                                const picked = selectedColor === c;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedColor(c)}
                                        className={["h-10 rounded-lg", c, "transition", picked ? "ring-2 ring-offset-2 ring-slate-700" : "hover:opacity-90"].join(" ")}
                                        aria-label={`color-${i}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <Divider className="!my-2" />

                    <div className="flex items-center justify-between gap-3">
                        <Button className="h-10 !bg-slate-300" onClick={() => setModalOpen(false)} type="text">
                            {t('cancel')}
                        </Button>
                        <Button type="primary" className="h-10 px-6" onClick={() => setModalOpen(false)}>
                            {t('create')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DrawerLabel;
