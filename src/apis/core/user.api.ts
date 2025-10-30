import axios from "axios";
import type { LoginUserType, RegUserType } from "../../types/user.type";
import i18 from "../../i18n/i18n.setup";
import * as jose from "jose";
import { Api } from "..";

const userApi = {
    getUser: async () => {
        const remember = localStorage.getItem("remember") == "true";
        const token = remember ? localStorage.getItem("token") : sessionStorage.getItem("token");
        

        const payload = await decodeToken(token ?? "");
        
        if (!payload) throw null;

        const userId = payload.userId;        
        
        const user = await axios.get(`${import.meta.env.VITE_DB_URL}/users/${userId}`);
        return user.data;
    },
    
    checkIsLogin: async () => {
        const remember = localStorage.getItem("remember") === "true";        
        const token = remember ? localStorage.getItem("token") : sessionStorage.getItem("token");
        const res = await decodeToken(token ?? "");
        return res ? true : false;
    },

    checkUserExisted: async (email: string, password?: string) => {
        try {
            const res = password
                ? await axios.get(`${import.meta.env.VITE_DB_URL}/users?email=${email}&password=${password}`)
                : await axios.get(`${import.meta.env.VITE_DB_URL}/users?email=${email}`);
            const users = res.data;

            return users.length > 0 ? users[0].id : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    register: async (data: RegUserType) => {
        await Api.user.checkIsLogin();
        try {
            const checkExist = await userApi.checkUserExisted(data.email);
            if (checkExist) {
                throw i18.t("email-already-exists");
            }
            const id = crypto.randomUUID();
            const newUser = { ...data, id, created_at: new Date().toISOString() };

            await axios.post(`${import.meta.env.VITE_DB_URL}/users`, newUser);
            return i18.t("register-successfully");
        } catch (error) {
            if (error && typeof error === "object" && "message" in error) {
                throw error.message as string;
            } else if (typeof error === "string") {
                throw error;
            }
            throw i18.t("register-failed");
        }
    },

    login: async (data: LoginUserType) => {
        const user = await userApi.checkUserExisted(data.email, data.password);
        if (!user) {
            throw i18.t("invalid-email-or-password");
        }
        const token = await createToken(user);

        if (data.remember) {
            localStorage.setItem("token", token);
            localStorage.setItem("remember", "true");
        } else {
            localStorage.setItem("remember", "false");
            sessionStorage.setItem("token", token);
        }

        return i18.t("login-successful");
    },
};

const createToken = async (userId: string) => {    
    const secret = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);
    const token = await new jose.SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(secret);
    return token;
};

const decodeToken = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);
        const { payload } = await jose.jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });

        return payload;
    } catch (error) {
        console.error("Token bị lỗi hoặc hết hạn", error);
        return null;
    }
};

// (async () => {
//   const token = await createToken("12345");
//   console.log("Token:", token);

//   const payload = await decodeToken(token);
//   console.log("Payload:", payload);
// })();

export default userApi;
