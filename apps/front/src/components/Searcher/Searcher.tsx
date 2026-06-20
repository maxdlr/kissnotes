import Modal from "@/components/Modal";
import useBrowse from "@/hooks/bread/useBrowse";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";
import { ExpressionModel } from "@kissnotes/types";
import { useMemo, useState } from "react";
import FormInput from "../FormInput";
import SearchResult from "./components/SearcherResult";
import useDebounce from "@/hooks/useDebounce";
import MasonryGrid from "../MasonryGrid";
import { useShortcut } from "@/hooks/useShortcut";
import { useRouter } from "next/navigation";

interface SearcherProps {
  onClose?: (e?: KissClickEvent) => void;
  placeholder?: string;
  value?: string;
}

const Searcher = ({
  onClose,
  value,
  placeholder = "Search anything",
}: SearcherProps) => {
  const [search, setSearch] = useState(value || "");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();

  useShortcut({ keys: ["up"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  });

  useShortcut({ keys: ["down"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    setSelectedIndex((prevIndex) => Math.max(prevIndex + 1, 0));
  });

  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions", {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const results = useMemo(() => expressions || [], [expressions]);

  const handleSearch = (e: KissChangeEvent) => {
    setSearch(e?.target?.value);
  };

  return (
    <Modal onClose={onClose} className="bg-dark p-8 max-w-2xl">
      <div className="space-y-4 sm:space-y-8">
        <div className="w-full">
          <FormInput
            autoFocus
            variant="ghost"
            name="search"
            placeholder={placeholder}
            value={value}
            onChange={handleSearch}
          />
        </div>
        <div className="space-y-4">
          {results.map((result) => {
            return (
              <div key={result.id}>
                <SearchResult
                  expression={result}
                  searchPrompt={search}
                  selected={results.indexOf(result) === selectedIndex}
                  onSelect={() => router.push(`/exp/${result.id}/m`)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
export default Searcher;
