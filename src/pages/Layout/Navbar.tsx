import { Menu, Dropdown } from "antd";
import { Header } from "antd/es/layout/layout";
import { DownOutlined } from "@ant-design/icons";
import trello_light from "../../assets/trello-light.png";
import { useTranslation } from "react-i18next";


const Navbar = () => {
    const { t } = useTranslation();
    const handleLanguageChange = (lang: string) => {
        localStorage.setItem("language", lang);
        window.location.reload(); 
    };

    const languageMenu = (
        <Menu>
            <Menu.Item key="en" onClick={() => handleLanguageChange("en")}>
                English
            </Menu.Item>
            <Menu.Item key="vi" onClick={() => handleLanguageChange("vi")}>
                Tiếng Việt
            </Menu.Item>
        </Menu>
    );

    return (
        <Header style={{ display: "flex", alignItems: "center" }}>
            <Menu theme="dark" mode="horizontal" className="flex-1 items-center" >
                <Menu.Item key="1">
                    <img src={trello_light} className="w-30" alt="Trello Logo" />
                </Menu.Item>
                <Menu.Item key="2" style={{ marginLeft: "auto" }}>
                    <Dropdown overlay={languageMenu} trigger={["click"]}>
                        <a onClick={(e) => e.preventDefault()}>
                            {t('select-language')} <DownOutlined />
                        </a>
                    </Dropdown>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
