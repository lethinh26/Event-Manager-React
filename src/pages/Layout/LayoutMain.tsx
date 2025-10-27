import React, { useEffect } from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useMatches } from "react-router";
import { Api } from "../../apis";

const LayoutMain: React.FC = () => {
    const matches = useMatches() as Array<{
        handle?: { sidebarVariant?: "default" | "special" };
    }>;
    const variant =
        (matches
            .slice()
            .reverse()
            .find((m) => m.handle?.sidebarVariant)?.handle?.sidebarVariant as "default" | "board") ?? "default";

    const checkIsLogin = async () => {
        const res = await Api.user.checkIsLogin();
        if (!res) {
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        checkIsLogin();
    }, []);

    return (
        <>
            <Layout>
                <Navbar />
                <SideBar variant={variant} />
            </Layout>
        </>
    );
};

export default LayoutMain;
