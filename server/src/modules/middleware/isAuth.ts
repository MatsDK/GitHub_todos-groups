import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { cookies } = context.req,
    [refreshToken, accessToken]: Array<string | undefined> = [
      cookies["refresh-token"],
      context.req.headers.cookie || cookies["access-token"],
    ];

  if (!accessToken && !refreshToken) return null;

  try {
    const decoded: any = verify(
      accessToken || "",
      process.env.ACCESS_TOKEN_SECRET as string
    );

    (context.req as any).userId = decoded.userId;
    return next();
  } catch {}

  if (!refreshToken) return null;

  let decodedRefreshToken: any;

  try {
    decodedRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  } catch {
    return null;
  }

  if (decodedRefreshToken)
    (context.req as any).userId = decodedRefreshToken.userId;

  return next();
};
