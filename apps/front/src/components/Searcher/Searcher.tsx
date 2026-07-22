import Modal from "@/components/Modal";
import ClientPortal from "@/components/ClientPortal";
import Loading from "@/components/Loading";
import useBrowse from "@/hooks/bread/useBrowse";
import useDebounce from "@/hooks/useDebounce";
import { useShortcut } from "@/hooks/useShortcut";
import { KissChangeEvent } from "@/types/form.types";
import {
  ArrowLeftIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import Button from "../Button";
import ExpressionDetails from "../ExpressionDetails";
import FormInput from "../FormInput";
import SearchResult from "./components/SearcherResult";
import useSearcher from "./hooks/SearcherProvider";
import { SearcherProps, SearchResultModel } from "./interfaces";
import useBreakpoints from "@/hooks/useBreakpoints";

const Searcher = ({ onClose }: SearcherProps) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { sm } = useBreakpoints();

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

  const {
    data: results,
    error,
    isValidating,
  } = useBrowse<SearchResultModel[]>("search", {
    search: debouncedSearch || "",
    maxResults: 30,
  });

  const searchResults = results || [];

  useEffect(() => {
    setSelectedIndex((prevIndex) => ({
      index: 0,
      native: prevIndex.native,
      mouse: false,
    }));
  }, [results, setSelectedIndex]);

  useShortcut({ keys: ["up"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    setSelectedIndex((prevIndex) => ({
      index: Math.max(prevIndex.index - 1, 0),
      native: prevIndex.native,
      mouse: false,
    }));
  });

  useShortcut({ keys: ["down"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    setSelectedIndex((prevIndex) => ({
      index: Math.min(prevIndex.index + 1, searchResults.length - 1),
      native: prevIndex.native,
      mouse: false,
    }));
  });

  const handleSearch = (e: KissChangeEvent) => {
    setPrompt(e?.target?.value);
  };

  useShortcut(
    { keys: ["enter"], ignoreInputs: false, blockers: [!isOpen, !!previewing] },
    (e) => {
      e.preventDefault();
      if (previewing) return;
      if (selectedIndex.index === undefined) return;

      const selectedResult = searchResults.at(selectedIndex.index);
      if (!selectedResult) return;

      setPreviewing({ id: selectedResult.id, native: selectedResult.native });

      inputRef.current?.focus();
    },
  );

  const handleClosePreview = () => {
    setPreviewing(undefined);
    inputRef.current?.focus();
  };

  const resultRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const setResultRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      if (node) resultRefs.current.set(index, node);
      else resultRefs.current.delete(index);
    },
    [],
  );

  useEffect(() => {
    if (selectedIndex.mouse) return;
    resultRefs.current.get(selectedIndex.index)?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [selectedIndex.index, selectedIndex.mouse]);

  const modalRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if (prompt) setPreviewing(undefined);
  }, [prompt, setPreviewing]);

  const handleExpand = () => {
    if (previewing) {
      router.push(`/exp/${previewing.id}${previewing.native ? "?native" : ""}`);
    }
    onClose?.();
  };

  const handleClear = () => {
    setPrompt("");
    inputRef.current?.focus();
  };

  const handleHover = (index: number, native: boolean) => {
    setSelectedIndex({ index, native, mouse: true });
  };

  const searchToolbar = (
    <div className="w-full flex justify-between items-center p-4 gap-6 rounded-3xl border border-accent">
      <FormInput
        StartChild={<BoltIcon className="w-6" />}
        ref={inputRef}
        autoFocus
        variant="ghost"
        name="search"
        placeholder='Search anything (e.g. "wiggle linear")'
        value={prompt}
        onChange={handleSearch}
        className="bg-transparent!"
        EndChild={
          <>
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
          </>
        }
      />
    </div>
  );

  return (
    <Modal
      ref={modalRef}
      className="bg-dark p-8 pt-0 max-w-2xl relative"
      isFullHeight={sm}
      isFullWidth={sm}
    >
      {({ zIndexModal }) => (
        <>
          {sm ? (
            <ClientPortal selector="#modal">
              <div
                className="fixed inset-x-0 bottom-0 p-4 bg-dark border-t border-accent/30"
                style={{ zIndex: zIndexModal + 1 }}
              >
                {searchToolbar}
              </div>
            </ClientPortal>
          ) : (
            <div className="sticky top-0 sm:-top-8 -ms-8 -me-8 px-8 z-60 bg-dark py-8 mb-4 rounded-t-2xl sm:rounded-t-3xl">
              {searchToolbar}
            </div>
          )}

          <div className={`space-y-4 ${sm ? "pb-28" : ""}`}>
            {!previewing ? (
              error ? (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ transformOrigin: "center" }}
                  className="w-fit mx-auto pb-12"
                >
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <span className="font-bold text-2xl">
                      Something went wrong
                    </span>
                    <span className="text-secondary">
                      Search is unavailable right now. Please try again.
                    </span>
                  </div>
                </motion.div>
              ) : (
                <>
                  {isValidating && (
                    <div
                      className="flex justify-center py-2"
                      aria-live="polite"
                    >
                      <Loading count={5} minSize={2} maxSize={10} />
                    </div>
                  )}
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => {
                      return (
                        <div
                          onMouseEnter={() => handleHover(index, result.native)}
                          key={`${result.id}-${index}`}
                          ref={setResultRef(index)}
                        >
                          <SearchResult
                            native={result.native}
                            ref={ref}
                            expression={result}
                            searchPrompt={prompt}
                            focused={index === selectedIndex.index}
                            onClick={() =>
                              setPreviewing({
                                id: result.id,
                                native: result.native,
                              })
                            }
                          />
                        </div>
                      );
                    })
                  ) : !isValidating ? (
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
                  ) : null}
                </>
              )
            ) : (
              previewing.id && (
                <ExpressionDetails
                  id={previewing.id}
                  native={previewing.native}
                />
              )
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
export default Searcher;
