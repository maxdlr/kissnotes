import type { KissClickEvent } from "@/types/form.types";
import Modal from "@/components/Modal";

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
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Search</h2>
      <input name="search" placeholder={placeholder} value={value} />
    </Modal>
  );
};
export default Searcher;
