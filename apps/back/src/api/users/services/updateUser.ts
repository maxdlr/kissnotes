import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";

const updateUser = async (user: UserEntity): Promise<UserEntity> => {
  const exists = await UserRepository.exists({ where: user });
  if (!exists) {
    throw ApiError("User doesn't exist.");
  }

  return await UserRepository.save(user);
};

export default updateUser;
