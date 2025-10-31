import { CloseSquareOutlined, LogoutOutlined, PlusOutlined, SettingOutlined, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import useNotify from "../../hooks/useNotify";
import type { BoardType } from "../../types/board.type";
import { useBoard } from "../../hooks/useBoard";

type PropsType = {
    variant: "default" | "board";
};

const SideBar = ({ variant }: PropsType) => {
    const { notify, contextHolder } = useNotify();
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    // const []
    const location = useLocation();
    const { id } = useParams();
    

    const board = useBoard();
    
    const formatBackground = (b: BoardType) => {
        if (b.backdrop) {
            if (b.backdrop.startsWith("./src")) {
                return { backgroundImage: `url(.${b.backdrop})` };
            } else if (b.backdrop.startsWith("https")) {
                return { backgroundImage: `url(${b.backdrop})` };
            }
        } else if (b.color) {
            return { backgroundColor: b.color };
        }

        return {};
    };

    const handleLogout = () => {
        notify(true, t("logged-out-successfully"));

        setTimeout(() => {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/login";
        }, 1000);
    };

    const selectedKeys = (() => {
        if (location.pathname.startsWith("/board/")) {
            return [`${id}`];
        } else if (location.search.includes("filter=starBoard")) {
            return ["2"];
        } else if (location.search.includes("filter=closedBoard")) {
            return ["3"];
        } else if (location.search.includes("filter=board")) {
            return ["1"];
        }
        return [];
    })();

    const items =
        variant === "default" ? (
            <>
                <Menu.Item key={4} icon={<SettingOutlined />}>
                    {t("settings")}
                </Menu.Item>
                <Menu.Item key={5} icon={<LogoutOutlined />} className="!text-red-500" onClick={handleLogout}>
                    {t("sign-out")}
                </Menu.Item>
            </>
        ) : (
            <>
                <div className={`flex justify-between font-bold items-center content-center px-3 mt-5 ${collapsed && "hidden"}`}>
                    <div>{t("your-boards")}</div>
                    <PlusOutlined className="cursor-pointer" />
                </div>
                {board?.filter(b => !b.is_closed).map((b) => {
                    return (
                        <Menu.Item key={b.id}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-[24px] h-[20px] bg-center bg-no-repeat bg-cover"
                                    style={formatBackground(b)}
                                />
                                <span>{b.title}</span>
                            </div>
                        </Menu.Item>
                    );
                })}
            </>
        );

    return (
        <>
            {contextHolder}
            <div className="h-[calc(100vh-48px)]">
                <Layout className="h-[calc(100vh-48px)]">
                    <Sider theme="dark" collapsible collapsed={collapsed} onCollapse={(set) => setCollapsed(set)} breakpoint="lg" width={240}>
                        <Menu mode="inline" selectedKeys={selectedKeys} theme="dark">
                            <div className={`px-3 mt-5 ${collapsed && "hidden"}`}>{t("your-workspaces")}</div>
                            <Menu.Item key="1" icon={<UnorderedListOutlined />} className="!mt-5" onClick={() => navigate("/dashboard?filter=board")}> 
                                {t("boards")}
                            </Menu.Item>
                            <Menu.Item key="2" icon={<StarOutlined />} onClick={() => navigate("/dashboard?filter=starBoard")}> 
                                {t("starred-boards")}
                            </Menu.Item>
                            <Menu.Item key="3" icon={<CloseSquareOutlined />} onClick={() => navigate("/dashboard?filter=closedBoard")}> 
                                {t("closed-boards")}
                            </Menu.Item>
                            <hr />
                            {items}
                        </Menu>
                    </Sider>
                    <Content className="p-6">
                        <Outlet />
                    </Content>
                </Layout>
            </div>
        </>
    );
};

export default SideBar;
