import ExpressionList from "@/app/(public)/_components/ExpressionList";
import Button from "@/components/Button";
import useAuth from "@/contexts/AuthContext/useAuth";
import useBrowse from "@/hooks/bread/useBrowse";
import { ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import { ExpressionModel } from "@kissnotes/types";

const SavesList = () => {
  const auth = useAuth();
  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions", {
    saves: { user: { id: auth?.user?.id } } as never,
  });

  return (
    <ExpressionList
      expressions={expressions as ExpressionModel[]}
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
