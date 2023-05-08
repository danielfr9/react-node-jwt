import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const createAccessToken = (
  id: string,
  firstName: string,
  lastName: string,
  email: string
) => {
  const accessToken = jwt.sign(
    {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "300s",
    }
  );

  return accessToken;
};

export const createRefreshToken = (email: string) => {
  const refreshToken = jwt.sign(
    {
      email: email,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  const cookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  };

  return { refreshToken, cookieOptions };
};
