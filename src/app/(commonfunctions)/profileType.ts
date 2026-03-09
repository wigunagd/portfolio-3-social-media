export interface UserCounts {
  post: number;
  followers: number;
  following: number;
  likes: number;
}

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  counts: UserCounts;
  isFollowing: boolean;
  isMe: boolean;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}