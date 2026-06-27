import UserEntity from "@/entities/UserEntity";
import SaveEntity from "@/entities/SaveEntity";
import UserRepository from "@/repositories/UserRepository";
import { UserModel } from "@kissnotes/types";

const findUser = async (
  {
    id,
    username,
    email,
  }: Partial<Pick<UserModel, "id" | "username" | "email">>,
  withPassword: boolean = false,
): Promise<UserEntity> => {
  let user!: UserEntity | null;

  if (withPassword) {
    const alias = id ? "user.id = :id" : "user.username = :username";
    const value = id
      ? { id }
      : username
        ? { username }
        : email
          ? { email }
          : {};

    user = await UserRepository.createQueryBuilder("user")
      .addSelect("user._password")
      .where(alias, value)
      .getOne();
  } else {
    user = await UserRepository.findOne({
      where: id
        ? { id: Number(id) }
        : username
          ? { username }
          : email
            ? { email }
            : {},
      loadRelationIds: {
        relations: ["saves"],
      },
    });
  }

  if (!user) {
    throw Missing("Cannot find user");
  }

  user.saves = user.saves?.map((s) => s.expression?.id) as unknown as SaveEntity[];

  return user;
};

export default findUser;
