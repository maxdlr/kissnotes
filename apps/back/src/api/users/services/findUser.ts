import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import { Id } from "@kissnotes/types";

const findUser = async (id: Id): Promise<UserEntity | null> => {
  const user = await UserRepository.findOneBy({ id });

  if (!user) {
    throw ApiError("Cannot find user");
  }

  return user;
};

export default findUser;
