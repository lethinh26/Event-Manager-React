import { Menu, type MenuProps } from "antd";
import { Header } from "antd/es/layout/layout";
// import trello from "../../../public/trello.png";
import trello_light from "../../assets/trello-light.png";


const Navbar = () => {
    return (
        <Header style={{ display: "flex", alignItems: "center", height: "48px"}}>
            <div className="demo-logo" />
            <Menu theme="dark" mode="vertical">
                <img src={trello_light} className="w-30"></img>
            </Menu>
        </Header>
    );
};

export default Navbar;
