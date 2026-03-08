import RefreshTokenRepository from "@/repositories/RefreshTokenRepository";
import { Id } from "@kissnotes/types";

const createRefreshToken = async (token: string, userId: Id) => {
  const expireOn = new Date(new Date().setDate(new Date().getDate() + 15)); // 15d from now

  await RefreshTokenRepository.save({
    token,
    expireOn,
    userId: Number(userId),
  });

  return token;
};

export default createRefreshToken;
