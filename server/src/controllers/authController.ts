import { Request, Response, NextFunction } from "express";
import { prisma } from "../server/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
  defaultCookieOptions,
} from "../helpers/jwt";
import { registerSchema, loginSchema } from "../schemas/auth";
import { RefreshToken } from "../types/jwt";

const saltRounds = 10;

export const registerUser = async (req: Request, res: Response) => {
  const validInputs = registerSchema.safeParse(req.body);

  if (!validInputs.success)
    return res.status(400).send({ error: validInputs.error });

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validInputs.data.email,
    },
  });

  if (existingUser !== null)
    return res
      .status(400)
      .send({ error: "An account already exists with this email" });

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(validInputs.data.password, salt);

    const { refreshToken, cookieOptions } = createRefreshToken(
      validInputs.data.email
    );
    const dbUser = await prisma.user.create({
      data: {
        firstName: validInputs.data.firstName,
        lastName: validInputs.data.lastName,
        email: validInputs.data.email,
        password: hash,
        password_salt: salt,
        refreshTokens: {
          create: {
            token: refreshToken,
          },
        },
      },
    });

    const accessToken = createAccessToken(
      dbUser.id,
      dbUser.firstName,
      dbUser.lastName,
      dbUser.email
    );

    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  // FIXME: User might have a cookie
  const validInputs = loginSchema.safeParse(req.body);

  if (!validInputs.success)
    return res.status(400).send({ error: validInputs.error });

  // Check if user exist
  const dbUser = await prisma.user.findUnique({
    where: {
      email: validInputs.data.email,
    },
  });

  if (!dbUser) return res.status(401).send({ error: "Invalid Credentials" });

  // Verify input password with database password
  const logHash = await bcrypt.hash(
    validInputs.data.password,
    dbUser.password_salt
  );
  const isValidPassword = await bcrypt.compare(
    validInputs.data.password,
    logHash
  );

  if (!isValidPassword)
    return res.status(401).send({ error: "Invalid Credentials" });

  try {
    const accessToken = createAccessToken(
      dbUser.id,
      dbUser.firstName,
      dbUser.lastName,
      dbUser.email
    );

    const { refreshToken, cookieOptions } = createRefreshToken(
      validInputs.data.email
    );

    // Add new access token to the database
    await prisma.user.update({
      where: {
        email: dbUser.email,
      },
      data: {
        refreshTokens: {
          create: {
            token: refreshToken,
          },
        },
      },
    });

    console.log("Login Refresh Token", refreshToken);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("LOGOUT COOKIES: ", cookies);

  if (!cookies?.refreshToken) return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;
  console.log(refreshToken);

  let decodedRefreshToken: RefreshToken | null = null;
  try {
    decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshToken;
  } catch (error) {
    // Token is invalid (expired or tampered token)
    return res.sendStatus(403);
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      email: decodedRefreshToken.email,
      refreshTokens: {
        some: {
          token: {
            equals: refreshToken,
          },
        },
      },
    },
  });

  // If no user for this refreshToken, just clear the cookie
  if (!dbUser) {
    res.clearCookie("refreshToken", defaultCookieOptions);
    return res.sendStatus(204);
  }

  // TODO: Make some kind of validation of the user
  // Remove the specific refreshToken
  const deletedToken = await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });

  // FIXME: Remove log
  console.log(deletedToken);

  res.clearCookie("refreshToken", defaultCookieOptions);
  return res.sendStatus(200);
};

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("REFRESH COOKIES: ", cookies);

  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  // FIXME: Remove log
  console.log("Cookies: ", req.cookies);

  let decodedRefreshToken: RefreshToken | null = null;
  try {
    decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshToken;
  } catch (error) {
    // Refresh token expired, is not from this server or has been tampered
    // FIXME: Remove log
    console.log(error);
    return res.sendStatus(403);
  }

  // FIXME: Remove log
  console.log("REFRESH TOKEN: ", decodedRefreshToken);

  const dbUser = await prisma.user.findFirst({
    where: {
      email: decodedRefreshToken.email,
      refreshTokens: {
        some: {
          token: {
            equals: refreshToken,
          },
        },
      },
    },
  });

  // FIXME: Potential reuse of refresh token (the token hasn't expired but is not longer in the DB)
  if (!dbUser) return res.status(403).send({ error: "Invalid refresh token" });

  const accessToken = createAccessToken(
    dbUser.id,
    dbUser.firstName,
    dbUser.lastName,
    dbUser.email
  );

  return res.status(200).json({ accessToken });
};
