import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { cookies } = context.req,
    [refreshToken, accessToken]: Array<string | undefined> = [
      cookies["refresh-token"],
      cookies["access-token"],
    ];

  if (!accessToken) return next();
  try {
    const decoded: any = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    (context.req as any).userId = decoded.userId;
    return next();
  } catch (err) {
    console.log(refreshToken);

    return next();
  }
};
