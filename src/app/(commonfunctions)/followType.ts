export interface FollowResponse {
    success: boolean;
    message: string;
    data: {
        following: boolean
    }
}