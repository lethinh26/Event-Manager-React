import React, { useEffect } from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useMatches } from "react-router";
import { Api } from "../../apis";
import { useBoard } from "../../hooks/useBoard";
import useAppDispatch from "../../hooks/useAppDispatch";
import { thunkGet } from "../../stores/slices/boardEntity/boardEntity.thunk";
import useAppSelector from "../../hooks/useAppSelector";

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

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        checkIsLogin();
    }, []);

    useEffect(() => {
        if (user.user?.id) {
            dispatch(thunkGet({ location: "boards", idLocation: "user_id", id: user.user.id }));
        }
    }, [user.user?.id, dispatch]);

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
