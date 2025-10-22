export interface BoardType {
    id: string;
    user_id: string;
    title: string;
    description: string;
    backdrop: string;
    is_starred: boolean;
    created_at: string;
}

export interface ListType {
    id: string;
    board_id: string;
    title: string;
    created_at: string;
}

export interface TaskType {
    id: string;
    list_id: string;
    title: string;
    description: string;
    status: boolean;
    position: number;
    due_date: string | null;
    created_at: string;
}

export interface TagType {
    id: string;
    task_id: string;
    content: string;
    color: string;
}