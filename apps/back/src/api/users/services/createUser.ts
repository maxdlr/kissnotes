import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import { UserModel } from "@kissnotes/types";

const createUser = async (user: UserModel): Promise<UserEntity> => {
  return await UserRepository.save(user as UserEntity);
};

export default createUser;
