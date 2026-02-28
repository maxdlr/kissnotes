import ExpressionRepository from "@/repositories/ExpressionRepository";

const removeExpression = async (where: any) => {
  const exists = await ExpressionRepository.exists({ where });
  if (!exists) {
    throw ApiError("Expression doesn't exist.");
  }
  return await ExpressionRepository.delete(where);
};

export default removeExpression;
