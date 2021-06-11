import { sign } from "jsonwebtoken";
import { User } from "../../src/entity/User";

export const refreshToken = (user: User): string => {
  return sign(
    { userId: user.id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export const accessToken = (user: User): string => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};
