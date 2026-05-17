import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import findUser from "./findUser";
import validateCrudPayload from "@/services/validateCrudPayload";

const updateUser = async (user: Partial<UserEntity>): Promise<UserEntity> => {
  if (!user.id) {
    throw ApiError("User id needed to update");
  }
  const foundUser = await findUser(user).catch(() => {
    throw ApiError("User doesn't exist");
  });

  const updatedUser: UserEntity = UserRepository.merge(foundUser, user);

  await validateCrudPayload(updatedUser);

  return await UserRepository.save(updatedUser);
};

export default updateUser;
