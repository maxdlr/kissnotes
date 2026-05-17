/** biome-ignore-all lint/suspicious/noArrayIndexKey: dontcare */
/** biome-ignore-all lint/suspicious/noExplicitAny: dontcare */

import { Children, cloneElement, isValidElement } from "react";
import { motion } from "motion/react";
import Button from "@/components/Button";
import type { FormWrapperProps } from "./interfaces";

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
          (e) => e.property === child.props.name,
        )?.messages;
        return cloneElement(child, { errors: fieldErrors });
      }
      return child;
    });
  };

  const footer = (
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
        />
      )}
    </div>
  );

  const items = [...hackChildren()];

  if (!animated) {
    return (
      <div className={`${containerClass} ${className}`}>
        <h1 className="text-4xl font-extrabold text-center">{title}</h1>
        {children}
        {footer}
      </div>
    );
  }

  const variants = itemVariants(animHeight);

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`${containerClass} ${className}`}
    >
      {title && (
        <h1 key="title" className="text-4xl font-extrabold text-center">
          {title}
        </h1>
      )}
      <div className={fieldsetClassName}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={variants as any}
            className={`${(item as any)?.props?.className ?? ""}`}
          >
            {item}
          </motion.div>
        ))}
      </div>
      {footer}
    </motion.form>
  );
};

export default FormWrapper;
