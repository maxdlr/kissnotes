import UserRepository from "@/repositories/UserRepository";
import { Id } from "@kissnotes/types";

const doesUserExist = async (id: Id): Promise<boolean> => {
  const userExists = await UserRepository.exists({
    where: { id: id as number },
  });
  return userExists;
};

export default doesUserExist;
