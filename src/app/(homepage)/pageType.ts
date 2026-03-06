export interface FeedPost {
    postId: number;
    userId: number;
    userName: string;
    displayName: string;
    userAvatar: string;
    imageUrl: string;
    caption: string;
    postDate: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isSaved: boolean;
    isLiked: boolean;
}