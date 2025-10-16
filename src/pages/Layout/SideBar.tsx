import { CloseSquareOutlined, LogoutOutlined, SettingOutlined, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";


const SideBar = () => {
    const {t} = useTranslation()
    const [collapsed, setCollapsed] = useState(false)
    return (
        <div className="h-[calc(100vh-48px)]">
            <Layout className="h-[calc(100vh-48px)]">
                <Sider theme="dark" collapsible collapsed={collapsed} onCollapse={(set) => setCollapsed(set)} breakpoint="lg" width={240}>
                    <Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} theme="dark">
                        <div className={`px-3 mt-5 ${collapsed && "hidden"}`}>{t('your-workspaces')}</div>
                        <Menu.Item key={1} icon={<UnorderedListOutlined />} className="!mt-5">{t('boards')}</Menu.Item>
                        <Menu.Item key={2} icon={<StarOutlined />}>{t('starred-boards')}</Menu.Item>
                        <Menu.Item key={3} icon={<CloseSquareOutlined />}>{t('closed-boards')}</Menu.Item>
                        <hr />
                        <Menu.Item key={4} icon={<SettingOutlined/>}>{t('settings')}</Menu.Item>
                        <Menu.Item key={5} icon={<LogoutOutlined/>}>{t('sign-out')}</Menu.Item>
                    </Menu>
                </Sider>
                <Content className="p-6">
                    <Outlet/>
                </Content>
            </Layout>
        </div>
    );
};

export default SideBar;
