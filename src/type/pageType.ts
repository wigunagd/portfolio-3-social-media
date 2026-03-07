export interface FeedParam {
  limit: number;
  page: number;
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
  success: boolean;
  message: string;
  data: {
    saved: boolean;
  };
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

/* -------------- */

interface LikeListProfile {
    profileId: number;
    displayName: string;
    userAvatar: string;
    userName: string;
}

export interface LikeListData {
    profile: LikeListProfile;
    followed: boolean;
}