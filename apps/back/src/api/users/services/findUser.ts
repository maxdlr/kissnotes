import UserEntity from "@/entities/UserEntity";
import SaveRepository from "@/repositories/SaveRepository";
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
        relations: ["expressions"],
      },
    });
  }

  if (!user) {
    throw Missing("Cannot find user");
  }

  const saves = await SaveRepository.find({
    where: { user: { id: user.id } },
    relations: ["expression", "nativeExpression"],
  });

  user.saves = [
    ...saves.filter((s) => s.expression).map((s) => s.expression!.id),
    ...saves
      .filter((s) => s.nativeExpression)
      .map((s) => `native:${s.nativeExpression!.id}`),
  ] as unknown as typeof user.saves;

  return user;
};

export default findUser;
