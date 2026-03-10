export interface UpdatedUserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  updatedAt: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UpdatedUserProfile;
}