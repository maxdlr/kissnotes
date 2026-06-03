import AddExpressionPage from "@/app/(public)/exp/add/page";
import Modal from "@/components/Modal";

const AddExpressionPageModal = () => {
  return (
    <Modal className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border">
      <AddExpressionPage />
    </Modal>
  );
};
export default AddExpressionPageModal;
