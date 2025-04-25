export interface User {
    id: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    balance: number;
}

export interface UserPayload {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
}

export interface UpdateUserPayload extends UserPayload {
    userId: string;
}