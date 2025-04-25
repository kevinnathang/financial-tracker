export interface Tag {
    id: string;
    name: string;
    color: string;
    icon: string | null;
    user_id: string;
}

export interface TagListResponse {
    tags: Tag[];
}

export interface TagPayload {
    name: string;
    color: string;
    icon?: string | null;
}

export interface CreateTagResponse {
    message: string;
    tag: Tag;
}

export interface UpdateTagPayload extends TagPayload {
    tagId: string;
}