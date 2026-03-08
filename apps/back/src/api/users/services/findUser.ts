import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";
import { UserModel } from "@kissnotes/types";

const findUser = async (
  { id, username, email }: Partial<UserModel>,
  withPassword: boolean = false,
): Promise<UserEntity | null> => {
  let user!: UserEntity | null;

  if (withPassword) {
    if (!id && !username) {
      throw CrudError("Id required to find a user with password");
    }
    const alias = id ? "user.id = :id" : "user.username = :username";
    const value = id ? { id } : { username };

    user = await UserRepository.createQueryBuilder("user")
      .addSelect("user._password")
      .where(alias, value)
      .getOne();
  } else {
    user = await UserRepository.findOneBy(
      id ? { id: Number(id) } : { username, email },
    );
  }

  if (!user) {
    throw ApiError("Cannot find user");
  }

  return user;
};

export default findUser;
