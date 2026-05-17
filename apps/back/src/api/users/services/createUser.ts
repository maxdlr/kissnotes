import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import validateCrudPayload from "@/services/validateCrudPayload";
import PasswordCheck from "@/utils/PasswordCheck";
import { UserModel } from "@kissnotes/types";
import { validate } from "class-validator";
import findUser from "./findUser";

const createUser = async (
  user: Pick<UserModel, "email" | "username" | "password" | "description">,
): Promise<UserEntity> => {
  const existingUser = await findUser({ username: user.username }).catch(
    () => {},
  );
  if (existingUser) {
    throw ApiError("User already exists");
  }

  const { email, username, password, description } = user;

  const userEntity = new UserEntity();
  userEntity.username = username;
  userEntity.email = email;
  userEntity.description = description;

  // Validate password before hashing
  const pwCheck = new PasswordCheck();
  pwCheck.password = password;
  const pwErrors = await validate(pwCheck);

  userEntity.password = password;

  await validateCrudPayload(userEntity, pwErrors);

  const newUser = await UserRepository.save(userEntity).catch(() => {
    throw ApiError("Cannot create new user");
  });

  return newUser;
};

export default createUser;
