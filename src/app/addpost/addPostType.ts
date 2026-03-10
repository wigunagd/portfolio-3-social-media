export interface AddPostResponse {
    success: boolean;
    message: string,
    data: {
        id: number;
        createdAt: string;
    }
}