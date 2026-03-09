export interface RequestParamLimitPage {
  limit: number;
  page: number;
  id?: number;
  q?: string;
}

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
  isLiked: boolean;
  isSaved: boolean;
}

/* -------------------- */

interface Author {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  isSaved?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedResponse {
  data: {
    posts: Post[];
    pagination: Pagination;
  };
}

/* ---------------------- */

export interface SavedResponse {
  data: {
    saved: boolean;
  };
}

export interface LikeCommentResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

/* -------------- */

export interface LikeCommentListProfile {
  profileId: number;
  displayName: string;
  userAvatar: string;
  userName: string;
  commentId?: number;
  comment?: string;
  followed?: boolean
}

export interface LikeListData {
  profile: LikeCommentListProfile;
}

/* --------------- */

interface PostLikeCommentUserProfile {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

export interface PostLikesResponse {
  data: {
    users: PostLikeCommentUserProfile[];
    pagination: Pagination;
  };
}

export interface CommentData {
  id: number;
  text: string;
  createdAt: string;
  author: PostLikeCommentUserProfile;
}

export interface PostCommentResponse {
  data: {
    comments: CommentData[];
    pagination: Pagination;
  };
}

export interface PostCommentBody {
  id:number;
  text: string;
}

/* ------------------ */

