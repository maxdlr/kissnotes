import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import { UserModel } from "@kissnotes/types";

const findUser = async ({
  id,
  username,
  email,
}: Partial<UserModel>): Promise<UserEntity | null> => {
  const user = await UserRepository.findOneBy({ id, username, email });

  if (!user) {
    throw ApiError("Cannot find user");
  }

  return user;
};

export default findUser;
