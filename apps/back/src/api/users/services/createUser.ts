import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import { UserModel } from "@kissnotes/types";
import findUser from "./findUser";

const createUser = async (
  user: Pick<UserModel, "email" | "username" | "password" | "description">,
): Promise<UserEntity> => {
  console.log({ user });
  await findUser({ username: user.username })
    .then(() => {
      throw ApiError("User already exists");
    })
    .catch(() => {});

  const { email, username, password, description } = user;

  const userEntity = new UserEntity();
  userEntity.username = username;
  userEntity.email = email;
  userEntity.password = password;
  userEntity.description = description;

  const newUser = await UserRepository.save(userEntity).catch((err) => {
    console.log({err})
    throw ApiError("Cannot create new user");
  });
  return newUser;
};

export default createUser;
