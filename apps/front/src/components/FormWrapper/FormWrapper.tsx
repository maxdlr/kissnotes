/** biome-ignore-all lint/suspicious/noArrayIndexKey: dontcare */
/** biome-ignore-all lint/suspicious/noExplicitAny: dontcare */

import { motion } from "motion/react";
import { Children, cloneElement, isValidElement } from "react";
import Button from "@/components/Button";
import type { FormWrapperProps } from "./interfaces";
import { KissClickEvent } from "@/types/form.types";

const distance = 200;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const itemVariants = (animHeight: number) => ({
  hidden: { y: animHeight, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.3 } },
  exit: { y: animHeight, opacity: 0, transition: { duration: 0.2 } },
});

const FormWrapper = ({
  children,
  title,
  className,
  fieldsetClassName,
  animated = false,
  animHeight = distance,
  errors,
  submit,
  cancel,
  loading = false,
}: FormWrapperProps) => {
  const containerClass = "flex flex-col items-center gap-8";

  console.log(errors);

  const hackChildren = () => {
    const flat = Children.toArray(children);
    return flat.map((child) => {
      if (isValidElement<any>(child)) {
        const fieldErrors = errors?.find(
          (e) => e.property === (child.props as any).name,
        )?.messages;
        return cloneElement(child, { errors: fieldErrors });
      }
      return child;
    });
  };

  const fieldSet = [...hackChildren()];
  const variants = itemVariants(animHeight);
  const FormTag = animated ? motion("form") : "form";
  const FieldSetTag = animated ? motion("div") : "div";

  const titleContent = title && (
    <h1 key="title" className="text-4xl font-extrabold text-center">
      {title}
    </h1>
  );

  const footerContent = (
    <div
      key="footer"
      className={`w-full flex items-center ${cancel?.onClick ? "justify-around" : "justify-center"}`}
    >
      {cancel && <Button variant="ghost" loading={loading} {...cancel} />}
      {submit && (
        <Button
          type="submit"
          variant={submit.disabled ? "outline" : "fill"}
          loading={loading}
          {...submit}
          onClick={undefined}
        />
      )}
    </div>
  );

  const fieldSetContent = (
    <div className={`w-full ${fieldsetClassName}`}>
      {fieldSet.map((field, i) => (
        <FieldSetTag
          key={i}
          variants={variants as any}
          className={`${(field as any)?.props?.className ?? ""}`}
        >
          {field}
        </FieldSetTag>
      ))}
    </div>
  );

  const handleSubmit = (e: KissClickEvent) => {
    e?.preventDefault();
    submit?.onClick?.(e);
  };

  return (
    <FormTag
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`${containerClass} ${className}`}
      onSubmit={handleSubmit}
    >
      {titleContent}
      {fieldSetContent}
      {footerContent}
    </FormTag>
  );
};

export default FormWrapper;
