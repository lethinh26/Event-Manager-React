// MoveCardModal.tsx
import React, { useMemo, useState } from "react";
import { Modal, Input, Select, Button, Typography } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
    open: boolean;
    onClose: () => void;
};

const { Title, Text } = Typography;

const ModalMoveCard: React.FC<Props> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const [boardName, setBoardName] = useState<string>("Tổ chức sự kiện Year-end party !");
    const [list, setList] = useState<string>("In-progress");
    const [position, setPosition] = useState<number>(1);

    const listOptions = useMemo(() => ["In-progress", "To do", "Done"].map((v) => ({ label: v, value: v })), []);
    const positionOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 })), []);

    const handleMove = () => onClose();

    return (
        <Modal open={open} onCancel={onClose} footer={null} width={560} centered>
            <div>
                <div className="flex items-center justify-between">
                    <Title level={4} className="!mb-0">
                        {t('move-card')}
                    </Title>
                </div>

                <div className="mt-3">
                    <Text className="!text-gray-400 font-semibold">{t('select-destination')}</Text>
                </div>

                <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('boar')}</label>
                    <Input value={boardName} onChange={(e) => setBoardName(e.target.value)} className="h-11" />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('list')}</label>
                        <Select className="w-full" value={list} onChange={setList} options={listOptions} size="large" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('position')}</label>
                        <Select className="w-full" value={position} onChange={setPosition} options={positionOptions} size="large" />
                    </div>
                </div>

                <div className="mt-6">
                    <Button type="primary" size="large" className="min-w-[110px]" onClick={handleMove}>
                        {t('move')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalMoveCard;
