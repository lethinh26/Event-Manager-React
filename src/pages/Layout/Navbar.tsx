import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
// import trello from "../../../public/trello.png";
import trello_light from "../../assets/trello-light.png";


const Navbar = () => {
    return (
        <Header style={{ display: "flex", alignItems: "center", height: "48px"}}>
            <Menu theme="dark" mode="vertical">
                <Menu.Item key="1">
                    <img src={trello_light} className="w-30" ></img>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
