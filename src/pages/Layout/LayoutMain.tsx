import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

const LayoutMain: React.FC = () => {
    return (
        <Layout>
            <Navbar />
            <SideBar />
        </Layout>
    );
};

export default LayoutMain;


