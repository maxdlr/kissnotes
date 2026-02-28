import UserRepository from "@/repositories/UserRepository";

const removeUser = async (where: any) => {
  const exists = await UserRepository.exists({ where });
  if (!exists) {
    throw ApiError("User doesn't exist.");
  }
  return await UserRepository.delete(where);
};

export default removeUser;
