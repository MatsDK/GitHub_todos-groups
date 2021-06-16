import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import cookie from "cookie";
import {
  refreshToken as createRefreshToken,
  accessToken as createAccessToken,
} from "../../../src/utils/authTokens";
import { User } from "../../../src/entity/User";
import {
  MAX_AGE_ACCESS_TOKEN,
  MAX_AGE_REFRESH_TOKEN,
} from "../../../src/constants";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const parsedCookies = cookie.parse(context.req.headers.cookie || "");
  const { cookies } = context.req,
    [refreshToken, accessToken]: Array<string | undefined> = [
      cookies["refresh-token"] || parsedCookies["refresh-token"],
      cookies["access-token"] || parsedCookies["access-token"],
    ];
  console.log(context.req);

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

  const user = await User.findOne(decodedRefreshToken.userId);
  if (!user) return null;

  const newRefreshToken: string = createRefreshToken(user),
    newAccessToken: string = createAccessToken(user);

  context.res.cookie("refresh-token", newRefreshToken, {
    maxAge: MAX_AGE_REFRESH_TOKEN,
  });
  context.res.cookie("access-token", newAccessToken, {
    maxAge: MAX_AGE_ACCESS_TOKEN,
  });

  return next();
};
