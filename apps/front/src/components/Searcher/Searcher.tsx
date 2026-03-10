import { Modal } from "../Modal";

interface SearcherProps {
  onClose?: (e?: Event | React.MouseEvent) => void;
  placeholder?: string;
  value?: string;
}

const Searcher = ({
  onClose,
  value,
  placeholder = "Search anything",
}: SearcherProps) => {
  console.log("modal");
  return (
    <Modal onClose={onClose}>
      {() => <input name="search" placeholder={placeholder} value={value} />}
    </Modal>
  );
};
export default Searcher;
