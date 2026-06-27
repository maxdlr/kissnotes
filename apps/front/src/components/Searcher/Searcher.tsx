import Modal from "@/components/Modal";
import useBrowse from "@/hooks/bread/useBrowse";
import useDebounce from "@/hooks/useDebounce";
import { useShortcut } from "@/hooks/useShortcut";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";
import {
  ArrowLeftIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ExpressionModel } from "@kissnotes/types";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Button from "../Button";
import ExpressionDetails from "../ExpressionDetails";
import FormInput from "../FormInput";
import SearchResult from "./components/SearcherResult";
import useSearcher from "./hooks/SearcherProvider";

interface SearcherProps {
  onClose?: (e?: KissClickEvent) => void;
  placeholder?: string;
}

const Searcher = ({
  onClose,
  placeholder = "Search anything",
}: SearcherProps) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    setPreviewing,
    previewing,
    setSelectedIndex,
    selectedIndex,
    prompt,
    setPrompt,
    isOpen,
  } = useSearcher();

  const debouncedSearch = useDebounce(prompt, 300);

  useShortcut({ keys: ["up"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  });

  useShortcut({ keys: ["down"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    setSelectedIndex((prevIndex) =>
      Math.min(prevIndex + 1, results.length - 1),
    );
  });

  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions", {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    maxResults: 20,
    published: true,
  });

  const results = useMemo(() => expressions || [], [expressions]);

  const handleSearch = (e: KissChangeEvent) => {
    setPrompt(e?.target?.value);
  };

  useShortcut(
    { keys: ["enter"], ignoreInputs: false, blockers: [!isOpen, !!previewing] },
    (e) => {
      e.preventDefault();
      if (previewing) return;
      setPreviewing(results.at(selectedIndex)?.id);
      inputRef.current?.focus();
    },
  );

  const handleClosePreview = () => {
    setPreviewing(undefined);
    inputRef.current?.focus();
  };

  const scrollCenterRef = useCallback(
    (node: HTMLDivElement | null) => {
      node?.scrollIntoView({
        block: "center" as ScrollLogicalPosition,
        behavior: "smooth" as ScrollBehavior,
      } as ScrollIntoViewOptions);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIndex],
  );

  const modalRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    modalRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [selectedIndex]);

  useEffect(() => {
    if (prompt) setPreviewing(undefined);
  }, [prompt, setPreviewing]);

  const handleExpand = () => {
    if (previewing) {
      router.push(`/exp/${previewing}`);
    }
    onClose?.();
  };

  const handleClear = () => {
    setPrompt("");
    inputRef.current?.focus();
  };

  return (
    <Modal ref={modalRef} className="bg-dark p-8 pt-4 pb-0 max-w-2xl">
      <div className="space-y-4 sm:space-y-8">
        <div className="w-full sticky top-8 z-50 bg-dark flex justify-between items-center p-4 gap-6 rounded-3xl border border-accent">
          <FormInput
            ref={inputRef}
            autoFocus
            variant="ghost"
            name="search"
            placeholder={placeholder}
            value={prompt}
            onChange={handleSearch}
            className="bg-transparent!"
          />
          {!prompt && !previewing && (
            <Button
              shortcut={{
                keys: ["ESC"],
                blockers: [!isOpen, !!previewing, !!prompt],
                ignoreInputs: false,
              }}
              variant="ghost"
              Icon={XMarkIcon}
              onClick={onClose}
              aria-label={"close searcher"}
            />
          )}
          {prompt && !previewing && (
            <Button
              shortcut={{
                keys: ["ESC"],
                blockers: [!isOpen, !!previewing, !prompt],
                ignoreInputs: false,
              }}
              label="Clear"
              variant="ghost"
              onClick={handleClear}
              aria-label={"clear search"}
            />
          )}
          {previewing && (
            <>
              <Button
                shortcut={{
                  keys: ["ESC"],
                  blockers: [!isOpen, !previewing],
                  ignoreInputs: false,
                }}
                variant="ghost"
                Icon={ArrowLeftIcon}
                onClick={handleClosePreview}
                aria-label={"close preview"}
              />
              <Button
                shortcut={{
                  keys: ["enter"],
                  blockers: [!isOpen, !previewing],
                  ignoreInputs: false,
                }}
                variant="ghost"
                Icon={ArrowsPointingOutIcon}
                onClick={handleExpand}
                aria-label={"expand preview"}
              />
            </>
          )}
        </div>
        <div className="space-y-4">
          {!previewing ? (
            results.length > 0 ? (
              results.map((result, index) => {
                return (
                  <div
                    key={result.id}
                    ref={index === selectedIndex ? scrollCenterRef : undefined}
                  >
                    <SearchResult
                      ref={ref}
                      expression={result}
                      searchPrompt={prompt}
                      focused={index === selectedIndex}
                      onClick={() => setPreviewing(result.id)}
                    />
                  </div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transformOrigin: "center" }}
                className="w-fit mx-auto pb-12"
              >
                <div className="flex flex-col gap-4 justify-center items-center">
                  <span className="font-bold text-2xl">No results</span>
                  <Button
                    label="Clear"
                    onClick={handleClear}
                    Icon={XMarkIcon}
                    shortcut={{
                      keys: ["ESC"],
                      ignoreInputs: false,
                      blockers: [!isOpen, !!previewing, !prompt],
                    }}
                  />
                </div>
              </motion.div>
            )
          ) : (
            <ExpressionDetails id={previewing} />
          )}
        </div>
      </div>
    </Modal>
  );
};
export default Searcher;
