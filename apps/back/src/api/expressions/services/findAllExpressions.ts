import ExpressionEntity from "@/entities/Expression";
import User from "@/entities/User";

const findAllExpressions = async (): Promise<ExpressionEntity[]> => {
  // const expressions = await ExpressionRepository.find();
  const expressions: ExpressionEntity[] = [
    {
      id: 1,
      title: "caca",
      user: new User(),
    },
  ];
  return expressions;
};

export default findAllExpressions;
