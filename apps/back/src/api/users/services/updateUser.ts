import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import findUser from "./findUser";

const updateUser = async (user: Partial<UserEntity>): Promise<UserEntity> => {
  if (!user.id) {
    throw ApiError("User id needed to update");
  }
  await findUser({ username: user.username }).catch(() => {
    throw ApiError("User already exists");
  });

  return await UserRepository.save(user);
};

export default updateUser;
