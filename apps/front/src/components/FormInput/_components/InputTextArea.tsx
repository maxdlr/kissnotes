import type { InputTextAreaProps } from "../interfaces";

const InputTextArea = ({
  ref,
  placeholder = "Search...",
  value,
  name,
  className,
  onClick,
  onFocus,
  onChange,
  disabled,
  Icon,
}: InputTextAreaProps) => {
  if (disabled && !value) {
    return <div className="h-px w-50 bg-accent/30 my-2" />;
  }

  return (
    <div className={`flex w-full items-center gap-2 ${className}`}>
      <textarea
        ref={ref}
        name={name}
        aria-label={name}
        autoComplete={name}
        placeholder={placeholder}
        className={`focus:ring-0 placeholder:font-normal focus:outline-none whitespace-nowrap w-full ${className}`}
        value={value}
        onClick={onClick}
        onChange={onChange}
        disabled={disabled}
        onFocus={onFocus}
      />
      {Icon && <Icon className="size-6 " />}
    </div>
  );
};
export default InputTextArea;
