import Modal from "@/components/Modal";
import AddExpressionPage from "../../../exp/add/page";

const AddExpressionPageModal = () => {
  return (
    <Modal
      className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border"
    >
      <AddExpressionPage />
    </Modal>
  );
};
export default AddExpressionPageModal;
