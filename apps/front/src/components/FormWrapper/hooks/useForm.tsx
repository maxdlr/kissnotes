import { KissFormErrors } from "@kissnotes/types";
import { useState } from "react";

const useForm = () => {
  const [errors, setErrors] = useState<KissFormErrors>([]);

  return {
    errors,
    setErrors,
  };
};
export default useForm;
