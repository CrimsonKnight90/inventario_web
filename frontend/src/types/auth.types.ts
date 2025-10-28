export type AuthToken = {
  access_token: string;
  token_type: "bearer" | string;
  expires_in: number; // seconds
  refresh_token?: string;
  scope?: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
  roles: string[];
};
