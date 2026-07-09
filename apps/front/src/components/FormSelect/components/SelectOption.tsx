import Button from "@/components/Button";
import { SelectedOptionProps } from "../interfaces";

const SelectedOption = <T,>({
  option,
  property,
  SelectedRenderOption,
  onDeselect,
}: SelectedOptionProps<T>) => (
  <div key={String(option[property])}>
    <Button
      animDirection="up"
      variant="fill"
      size="sm"
      onClick={() => onDeselect(option)}
      label={SelectedRenderOption?.(option) || (option[property] as string)}
    />
  </div>
);

export default SelectedOption;
