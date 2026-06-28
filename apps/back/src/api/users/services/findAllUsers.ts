import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";

const findAllUsers = async (where?: any): Promise<UserEntity[]> => {
  const { search, maxResults, ...sanitizedWhere } = where || {};
  const users = await UserRepository.findBy(sanitizedWhere);
  return users;
};

export default findAllUsers;
