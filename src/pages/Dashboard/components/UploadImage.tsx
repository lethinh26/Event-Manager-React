import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type PropsType = {
    loading: boolean
}

const UploadImage = ({loading}: PropsType) => {
    const {t} = useTranslation()
    const [imageUrl, setImageUrl] = useState();

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>{t('upload')}</div>
        </button>
    );
    return (
        <div>
            <Upload
                name="image"
                listType="picture-card"
                // className="avatar-uploader"
                showUploadList={false}
                beforeUpload={() => false}
                // onChange={handleChange}
            >
                {imageUrl ? <img draggable={false} src={imageUrl} alt="image" style={{ width: "100%" }} /> : uploadButton}
            </Upload>
        </div>
    );
};

export default UploadImage;
