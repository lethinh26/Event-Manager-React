import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload, type UploadFile, type UploadProps } from "antd";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type PropsType = {
    imageUrl: string | null;
    setUrlImage: (url: string | null) => void;
};

const UploadImage = ({ imageUrl, setUrlImage }: PropsType) => {
    const { t } = useTranslation();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const uploadImage: UploadProps["customRequest"] = (options) => {
        const { file, onProgress, onSuccess, onError } = options;

        const form = new FormData();
        form.append("file", file as File);
        form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

        axios
            .post(import.meta.env.VITE_CLOUDINARY_URL, form, {
                onUploadProgress: (e) => {
                    if (onProgress && e.total) onProgress({ percent: (e.loaded / e.total) * 100 });
                },
            })
            .then((res) => {
                onSuccess?.(res.data);
                message.success(t("upload-successful"));
                setUrlImage(res.data.secure_url);
            })
            .catch((err) => {
                onError?.(err);
                message.error(t("upload-failed"));
            });
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{t("upload")}</div>
        </button>
    );

    // upload ảnh -> qua thẻ uplaod -> Upload gọi uploadImage(error, success) ->  xong Upload nhận onChange
    return (
        <div>
            {imageUrl !== null ? (
                <>
                    <div className="relative !w-[100px] !h-[100px] rounded-lg overflow-hidden">
                        <img src={imageUrl} alt="avatar" className="!w-[100px] !h-[100px] absolute inset-0 bg-center bg-cover" />
                    </div>
                </>
            ) : (
                <Upload
                    accept="image/*"
                    listType="picture-card"
                    customRequest={uploadImage}
                    fileList={fileList}
                    multiple={false}
                    maxCount={1}
                    onChange={({ fileList }) => {
                        const mapped = fileList.map((f) => (f.response?.secure_url && !f.url ? { ...f, url: f.response.secure_url } : f));
                        setFileList(mapped);
                    }}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            )}
        </div>
    );
};

export default UploadImage;
