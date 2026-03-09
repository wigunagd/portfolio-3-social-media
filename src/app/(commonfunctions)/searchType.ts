export interface UserSearchResult {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

export interface SearchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserSearchResponse {
  success: boolean;
  message: string;
  data: {
    users: UserSearchResult[];
    pagination: SearchPagination;
  };
}