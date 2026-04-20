import type { InputTextProps } from "../interfaces";

const InputText = ({
  ref,
  type = "text",
  placeholder = "Search...",
  value,
  name,
  className,
  onClick,
  onFocus,
  onChange,
  disabled,
  Icon,
  password,
}: InputTextProps) => {
  if (disabled && !value) {
    return <div className="h-px w-50 bg-accent/30 my-2" />;
  }
  const localValue = password
    ? value
        ?.split("")
        .map(() => "•")
        .join("")
    : value;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`focus:ring-0 placeholder:font-normal focus:outline-none whitespace-nowrap w-full ${className}`}
        value={localValue}
        onClick={onClick}
        onChange={onChange}
        disabled={disabled}
        onFocus={onFocus}
      />
      {Icon && <Icon className="size-6 " />}
    </div>
  );
};
export default InputText;
