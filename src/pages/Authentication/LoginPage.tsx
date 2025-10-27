import { Form, Input, Button, Checkbox } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import useNotify from "../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Api } from "../../apis";
import type { LoginUserType } from "../../types/user.type";
import { useEffect } from "react";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { notify, contextHolder } = useNotify();

    const [form] = Form.useForm();

    useEffect(() => {
        const checkLogin = async () => {
            const isLogin = await Api.user.checkIsLogin();
            if (isLogin) {
                navigate("/dashboard");
            }
        };
        checkLogin();
    }, []);

    const onFinish = async (values: LoginUserType) => {
        // const userObj = { email: values.email, password: values.password };
        console.log(values);

        try {
            const noti = await Api.user.login(values);
            notify(true, noti);
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            notify(false, error as string);
        }
        // console.log("Registered:", values);
        form.resetFields();
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<LoginUserType>) => {
        notify(false, `${t("login-failed")}\n${errorInfo}`);
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold mb-2">Trello</h1>
                    <p className="text-center text-2xl mb-4 font-bold">{t("sign-in")}</p>

                    <Form form={form} name="register" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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

                        <Form.Item label={t("password")} name="password" rules={[{ required: true, message: t("please-enter-password") }]}>
                            <Input.Password placeholder={t("password")} />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked" label={null}>
                            <Checkbox>{t("remember-me")}</Checkbox>
                        </Form.Item>

                        <Form.Item shouldUpdate>
                            {() => {
                                const isValidedAll = form.isFieldsValidating();
                                const hasError = form.getFieldsError().some(({ errors }) => errors.length);
                                return (
                                    <Button type="primary" htmlType="submit" className="w-full" disabled={hasError || isValidedAll}>
                                        {t("login")}
                                    </Button>
                                );
                            }}
                        </Form.Item>
                    </Form>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        {t("dont-have-an-account")}{" "}
                        <a className="text-blue-500" href="/register">
                            {t("register")}
                        </a>
                    </div>

                    <div className="text-gray-600 text-center mt-5">© 2025 - Rikkei Education</div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
