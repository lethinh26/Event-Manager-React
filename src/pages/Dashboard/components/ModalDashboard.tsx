import { CheckOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, ColorPicker, Input, Modal, Upload } from "antd";
import React, { useState } from "react";
import UploadImage from "./UploadImage";
import { useTranslation } from "react-i18next";

type PropsType = {
    open: boolean,
    isEditing: boolean,
    onCancel: () => void,
    onOk: () => void
}

const ModalDashboard = ({open, isEditing, onCancel, onOk}: PropsType) => {
    const {t} = useTranslation()
    const backgrounds = ["board-default1.jpg", "board-default2.jpg", "board-default3.jpg"];
    const colors = ["#FF8A00", "#E11D48", "#10B981", "#22D3EE", "#EAB308", "#8B5CF6"];
    const [title, setTitle] = useState("");
    const [selectedBg, setSelectedBg] = useState<string | undefined>();
    const [selectedColor, setSelectedColor] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);



    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={520}
            title={
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{isEditing? t('update-board') : t('create-board')}</span>
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="text-slate-700 font-medium">{t('background')}</div>
                    <div className="flex items-center gap-5.5">
                        {backgrounds.map((src) => {
                            const active = selectedBg === src;
                            return (
                                <>
                                    <button
                                        key={src}
                                        type="button"
                                        onClick={() => setSelectedBg(src)}
                                        className={[
                                            "relative w-[100px] h-[100px] rounded-lg overflow-hidden",
                                            "bg-slate-200",
                                            active ? "ring-2 ring-slate-800" : "ring-1 ring-slate-200",
                                            "focus:outline-none focus:ring-2 focus:ring-slate-800",
                                        ].join(" ")}
                                        title={src}
                                    >
                                        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${src})` }} />
                                        {active && (
                                            <span className="absolute right-1 top-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 shadow">
                                                <CheckOutlined className="text-slate-700 text-xs" />
                                            </span>
                                        )}
                                    </button>
                                </>
                            );
                        })}
                       <UploadImage loading={loading}/>
                    </div>
                </div>

                <hr className="border-slate-200" />
                <div className="flex flex-col gap-2">
                    <div className="text-slate-700 font-medium">{t('color')}</div>
                    <div className="flex items-center gap-3">
                        {colors.map((hex) => {
                            const active = selectedColor === hex;
                            return (
                                <button
                                    key={hex}
                                    type="button"
                                    onClick={() => setSelectedColor(hex)}
                                    className={[
                                        "relative w-12 h-8 rounded-md",
                                        active ? "ring-2 ring-slate-800" : "ring-1 ring-slate-200",
                                        "focus:outline-none focus:ring-2 focus:ring-slate-800",
                                    ].join(" ")}
                                    title={hex}
                                    style={{ backgroundColor: hex }}
                                >
                                    {active && (
                                        <span className="absolute right-1 top-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/95 shadow">
                                            <CheckOutlined className="text-slate-700 text-[10px]" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                        <ColorPicker
                            allowClear
                            showText={false}
                            mode={["single", "gradient"]}
                            onChangeComplete={(color) => {
                                console.log(color.toCssString());
                            }}
                        />
                    </div>
                </div>

                <hr className="border-slate-200" />

                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 font-medium">
                        {t('board-title')} <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="E.g. Shopping" className="h-11" value={title} onChange={(e) => setTitle(e.target.value)} />
                    {!title && <div className="text-sm text-red-500">{t('please-provide-a-valid-board-title')}</div>}
                </div>

                <div className="mt-2 flex justify-end gap-2">
                    <Button danger onClick={onCancel}>
                        {t('close')}
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        {t('create')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalDashboard;
