import { Form, Input, Button } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import useNotify from "../../hooks/useNotify";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router";

interface LoginFormType {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const {t} = useTranslation()
    const { notify, contextHolder } = useNotify();

    const [form] = Form.useForm();

    const onFinish = (values: LoginFormType) => {
        console.log("Registered:", values);
        notify(true, t('login-successful'));
        form.resetFields();
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<LoginFormType>) => {
        notify(false, `${t('login-failed')}\n${errorInfo}`);
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold mb-2">Trello</h1>
                    <p className="text-center text-2xl mb-4 font-bold">{t('sign-in')}</p>

                    <Form form={form} name="register" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item label={t('email')} name="email" rules={[{ required: true, type: "email", message: t('please-enter-email') }]}>
                            <Input placeholder="email@gmail.com" />
                        </Form.Item>

                        <Form.Item label={t('password')} name="password" rules={[{ required: true, message: t('please-enter-password') }]}>
                            <Input.Password placeholder={t('password')} />
                        </Form.Item>

                        <Form.Item shouldUpdate>
                            {() => {
                              const isValidedAll = form.isFieldsValidating()
                              const hasError = form.getFieldsError().some(({errors}) => errors.length)
                              const isTouched = form.isFieldsTouched(true)
                                return (
                                    <Button type="primary" htmlType="submit" className="w-full" disabled={!isTouched || hasError || isValidedAll}>
                                        {t('login')}
                                    </Button>
                                );
                            }}
                        </Form.Item>
                    </Form>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        {t('dont-have-an-account')} {" "} 
                        <a className="text-blue-500" href="/register">
                            {t('register')}
                        </a>
                    </div>

                    <div className="text-gray-600 text-center mt-5">© 2025 - Rikkei Education</div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
