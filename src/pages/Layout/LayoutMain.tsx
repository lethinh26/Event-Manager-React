import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useMatches } from "react-router";

const LayoutMain: React.FC = () => {
    const matches = useMatches() as Array<{
        handle?: { sidebarVariant?: "default" | "special" };
    }>;
    const variant = (matches.slice().reverse().find((m) => m.handle?.sidebarVariant)?.handle?.sidebarVariant as "default" | "board") ?? "default";
    return (
        <Layout>
            <Navbar />
            <SideBar variant={variant} />
        </Layout>
    );
};

export default LayoutMain;
