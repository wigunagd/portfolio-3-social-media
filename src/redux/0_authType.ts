export interface AuthState {
    isLoggedin: boolean;
    accessToken: string;
    loginId: number;
    loginName: string;
    avatarUrl: string;
}

export interface MeProfileType {
  id: number | null;
  name: string | null;
  email: string | null;
  username: string | null;
  headline: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
}