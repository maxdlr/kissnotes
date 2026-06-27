/** biome-ignore-all lint/suspicious/noArrayIndexKey: dontcare */
/** biome-ignore-all lint/suspicious/noExplicitAny: dontcare */

import { motion } from "motion/react";
import { Children, cloneElement, isValidElement, useEffect } from "react";
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

const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

const FormWrapper = ({
  children,
  title,
  className = "",
  fieldsetClassName = "",
  animated = false,
  animHeight = distance,
  errors,
  submit,
  cancel,
  loading = false,
}: FormWrapperProps) => {
  const containerClass = "flex flex-col items-center gap-8";

  const injectErrors = (child: React.ReactElement<any>) => {
    const fieldErrors = errors?.find(
      (e) => e.property === (child.props as any).name,
    )?.messages;
    return fieldErrors ? cloneElement(child, { errors: fieldErrors }) : child;
  };

  const processChildren = (nodes: React.ReactNode): React.ReactNode => {
    return Children.map(nodes, (child) => {
      if (!isValidElement<any>(child)) return child;
      if ((child.props as any).name) {
        childNames.push((child.props as any).name);
        return injectErrors(child);
      }
      return child;
    });
  };

  const variants = itemVariants(animHeight);
  const FormTag = animated ? motion("form") : "form";
  const FieldSetTag = animated ? motion("div") : "div";

  const childNames: string[] = [];

  const renderFields = () => {
    const flat = Children.toArray(children);
    return flat.map((child, i) => {
      if (!isValidElement<any>(child)) return child;

      const props = child.props as any;

      if ((child.type as any) === Layout) {
        return (
          <FieldSetTag
            key={i}
            variants={variants as any}
            className={props.className ?? ""}
          >
            {processChildren(props.children)}
          </FieldSetTag>
        );
      }

      if (props.name) childNames.push(props.name);

      return (
        <FieldSetTag
          key={i}
          variants={variants as any}
          className={props.className ?? ""}
        >
          {injectErrors(child)}
        </FieldSetTag>
      );
    });
  };

  const fields = renderFields();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && errors?.length) {
      for (const err of errors) {
        if (!childNames.includes(err.property)) {
          console.warn(
            `[FormWrapper] Error for "${err.property}" has no matching child (available: ${childNames.join(", ") || "none"})`,
          );
        }
      }
    }
  });

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
    <div className={`w-full ${fieldsetClassName}`}>{fields}</div>
  );

  const handleSubmit = (e: KissClickEvent) => {
    e?.preventDefault();
    submit?.onClick?.(e);
  };

  return (
    // eslint-disable-next-line react-hooks/static-components
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

FormWrapper.Layout = Layout;
export default FormWrapper;
