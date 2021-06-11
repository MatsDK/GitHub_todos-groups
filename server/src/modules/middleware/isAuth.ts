import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  const { cookies } = context.req,
    [refreshToken, accessToken]: Array<string | undefined> = [
      cookies["refresh-token"] || args["refreshToken"],
      cookies["access-token"] || args["accessToken"],
    ];

  if (!accessToken && !refreshToken) return next();

  try {
    const decoded: any = verify(
      accessToken || "",
      process.env.ACCESS_TOKEN_SECRET as string
    );

    (context.req as any).userId = decoded.userId;
    return next();
  } catch {}

  if (!refreshToken) return next();

  let decodedRefreshToken: any;

  try {
    decodedRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  } catch {
    return next();
  }

  console.log(decodedRefreshToken);

  return next();
};
