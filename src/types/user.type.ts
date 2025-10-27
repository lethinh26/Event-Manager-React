export interface RegUserType {
    username: string;
    email: string;
    password: string;
}

export interface LoginUserType {
    email: string;
    password: string;
    remember?: boolean;
}

export interface UserType {
    id: string;
    username: string;
    email: string;
    password: string;
    created_at: string;
}