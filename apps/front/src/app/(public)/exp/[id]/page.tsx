import { Metadata } from "next";
import { fetchExpressionById } from "./_utils/fetchExpressionById";
import ExpressionById from "./m/_components/ExpressionById";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const expression = await fetchExpressionById(id);

  return {
    title: `Kissnotes • ${expression.title}`,
    description:
      expression.description ||
      `Explore the expression "${expression.title}" on Kissnotes.`,
  };
}

const ExpressionByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ExpressionById id={id} />;
};

export default ExpressionByIdPage;
