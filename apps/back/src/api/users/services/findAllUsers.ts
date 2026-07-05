import UserEntity from "@/entities/UserEntity";
import UserRepository from "@/repositories/UserRepository";

const findAllUsers = async (where?: any): Promise<UserEntity[]> => {
  const { search, maxResults, ...sanitizedWhere } = where || {};
  const users = await UserRepository.find({
    where: sanitizedWhere,
    loadRelationIds: { relations: ["saves", "expressions"] },
  });
  return users;
};

export default findAllUsers;
