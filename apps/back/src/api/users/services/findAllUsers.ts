import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";

const findAllUsers = async (where?: any): Promise<UserEntity[]> => {
  const users = await UserRepository.findBy(where);
  return users;
};

export default findAllUsers;
