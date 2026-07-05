import ExpressionList from "@/app/(public)/_components/ExpressionList";
import Button from "@/components/Button";
import useAuth from "@/contexts/AuthContext/useAuth";
import { ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import { BrowseResult } from "@/hooks/useExpressionBrowse";
import useSWR from "swr";

const SavesList = () => {
  const auth = useAuth();
  const { data: expressions } = useSWR<BrowseResult[]>(
    auth?.user?.id
      ? {
          url: "/search/browse",
          params: { mode: "saved", userId: auth.user.id, maxResults: 50 },
        }
      : null,
  );

  return (
    <ExpressionList
      expressions={expressions || []}
      openModals
      emptyMsg={
        <div className="flex flex-col items-center justify-center gap-4">
          <p>You haven&apos;t saved any expression yet.</p>
          <Button
            label="Browse expressions"
            href="/"
            Icon={ArrowUpLeftIcon}
          />
        </div>
      }
    />
  );
};
export default SavesList;
