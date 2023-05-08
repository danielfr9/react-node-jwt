export type RefreshToken = {
  email: string;
  iat: number;
  exp: number;
};

export type AccessToken = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  iat: number;
  exp: number;
};
