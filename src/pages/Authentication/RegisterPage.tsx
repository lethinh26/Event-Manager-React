import { Form, Input, Button } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import type { RuleObject } from "antd/es/form";
import useNotify from "../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import { Api } from "../../apis";
import { useNavigate } from "react-router";
import { useEffect } from "react";

interface RegFormType {
    username: string;
    email: string;
    password: string;
    confirm: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { notify, contextHolder } = useNotify();

    useEffect(() => {
        const checkLogin = async () => {
            const isLogin = await Api.user.checkIsLogin();
            if (isLogin) {
                navigate("/dashboard");
            }
        };
        checkLogin();
    }, [navigate]);

    const [form] = Form.useForm();

    const onFinish = async (values: RegFormType) => {
        try {
            const noti = await Api.user.register({
                username: values.username,
                email: values.email,
                password: values.password,
            });
            notify(true, noti);

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            notify(false, error as string);
        }
        form.resetFields();
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<RegFormType>) => {
        notify(false, `${t("register-failed")}\n${errorInfo}`);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    {/* <button onClick={() => notify(true, "abcdef")}>Test</button> */}
                    <h1 className="text-4xl font-bold mb-2">Trello</h1>
                    <p className="text-center text-2xl mb-4 font-bold">{t("sign-up")}</p>

                    <Form form={form} name="register" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item label={t("username")} name="username" rules={[{ required: true, message: t("please-enter-username") }]}>
                            <Input placeholder={t("username")} />
                        </Form.Item>

                        <Form.Item
                            label={t("email")}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: t("please-enter-email"),
                                },
                            ]}
                        >
                            <Input placeholder="email@gmail.com" />
                        </Form.Item>

                        <Form.Item
                            label={t("password")}
                            name="password"
                            rules={[
                                { required: true, message: t("please-enter-password") },
                                {
                                    min: 6,
                                    message: t("password-must-be-at-least-6-characters"),
                                },
                            ]}
                        >
                            <Input.Password placeholder={t("password")} />
                        </Form.Item>

                        <Form.Item
                            label={t("confirm-password")}
                            name="confirm"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: t("please-re-enter-your-password") },
                                ({ getFieldValue }) => ({
                                    validator(_: RuleObject, value: string) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t("password-do-not-match")));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder={t("please-re-enter-your-password")} />
                        </Form.Item>

                        <Form.Item shouldUpdate>
                            {() => {
                                const hasError = form.getFieldsError().some(({ errors }) => errors.length); // bắt error val pass
                                const isValidedAll = form.isFieldsValidating?.(); // bắt val
                                const isTouched = form.isFieldsTouched(true); // bắt chạm
                                // console.log(isValidedAll, isTouched, hasError);

                                return (
                                    <Button type="primary" htmlType="submit" className="w-full" disabled={isValidedAll || !isTouched || hasError}>
                                        Đăng ký
                                    </Button>
                                );
                            }}
                        </Form.Item>
                    </Form>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        {t("already-have-an-account")}{" "}
                        <a className="text-blue-500" href="/login">
                            {t("login")}
                        </a>
                    </div>

                    <div className="text-gray-600 text-center mt-5">© 2025 - Rikkei Education</div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
