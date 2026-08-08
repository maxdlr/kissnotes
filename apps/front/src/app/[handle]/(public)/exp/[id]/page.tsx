import type { Metadata } from "next";
import { fetchExpressionById } from "@/app/(public)/exp/[id]/_utils/fetchExpressionById";
import UserExpressionById from "./_components/UserExpressionById";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; handle: string }>;
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
    // Same expression is also reachable at /exp/[id] (the profile-scoped URL
    // is a UX convenience, not a distinct piece of content) — canonicalize to
    // the unscoped URL to avoid duplicate-content indexing.
    alternates: {
      canonical: `/exp/${id}`,
    },
  };
}

const UserExpressionByIdPage = () => {
  return <UserExpressionById />;
};

export default UserExpressionByIdPage;
