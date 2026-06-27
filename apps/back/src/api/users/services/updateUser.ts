import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import validateCrudPayload from "@/services/validateCrudPayload";
import { UserModel } from "@kissnotes/types";
import findUser from "./findUser";

const updateUser = async (
  user: Partial<UserModel | UserEntity>,
): Promise<UserEntity> => {
  if (!user.id) {
    throw ApiError("User id needed to update");
  }
  const foundUser = await findUser(user).catch(() => {
    throw ApiError("User doesn't exist");
  });

  const { saves, ...editables } = user;

  const updatedUser: UserEntity = UserRepository.merge(
    foundUser,
    editables as UserEntity,
  );

  await validateCrudPayload(updatedUser);

  return await UserRepository.save(updatedUser);
};

export default updateUser;
