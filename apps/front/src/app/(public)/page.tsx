import { Metadata } from "next";
import HomePageWrapper from "./_components/HomePage";

export const metadata: Metadata = {
  title: "Kissnotes - Explore AE Expressions",
  description:
    "Discover and explore a wide range of expressions created by the community. Filter by tokens, authors, and more to find the perfect expression for your needs.",
};

export default function ExpressionListPageWrapper() {
  return <HomePageWrapper />;
}
