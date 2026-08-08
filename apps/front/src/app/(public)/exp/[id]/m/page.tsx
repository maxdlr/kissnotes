import type { Metadata } from "next";
import { fetchExpressionById } from "../_utils/fetchExpressionById";
import ExpressionByIdModalPage from "./_components/ExpressionByIdModalPage";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
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
    // /exp/[id]/m is the modal-view URL used when navigating from a listing
    // (homepage or profile) — same content as /exp/[id], so canonicalize there.
    alternates: {
      canonical: `/exp/${id}`,
    },
  };
}

const ExpressionByIdModalPageWrapper = () => {
  return <ExpressionByIdModalPage />;
};

export default ExpressionByIdModalPageWrapper;
