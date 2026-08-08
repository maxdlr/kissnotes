import { Metadata } from "next";
import { fetchExpressionById } from "./_utils/fetchExpressionById";
import ExpressionById from "./m/_components/ExpressionById";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sParams = await searchParams;

  const expression = await fetchExpressionById(id, "native" in sParams);

  return {
    title: `Kissnotes • ${expression.title}`,
    description:
      expression.description ||
      `Explore the expression "${expression.title}" on Kissnotes.`,
    // /exp/[id] is the canonical URL for an expression. The same expression is
    // also reachable at /@handle/exp/[id] when browsed from a profile page —
    // this tells search engines to index this URL instead of that one.
    alternates: {
      canonical: `/exp/${id}`,
    },
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
