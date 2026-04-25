/** biome-ignore-all lint/suspicious/noArrayIndexKey: dontcare */
/** biome-ignore-all lint/suspicious/noExplicitAny: dontcare */
import { motion } from "motion/react";
import { Button } from "../Button";
import type { FormWrapperProps } from "./interfaces";
import { ReactNode } from "react";

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
  animated = false,
  animHeight = distance,
  errors,
  submit = {
    disabled: false,
  },
}: FormWrapperProps) => {
  const containerClass = "flex flex-col items-center gap-8";

  const hackChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child) => ({
        ...child,
        props: { ...child.props, error: errors?.[child.props.name] },
      }));
    }
    return [children];
  };

  const items = [
    // biome-ignore lint/complexity/noUselessFragments: need
    <>
      {title && (
        <h1 key="title" className="text-4xl font-extrabold text-center">
          {title}
        </h1>
      )}
    </>,
    ...hackChildren(),
    <Button key="submit" {...submit} />,
  ];

  if (!animated) {
    return (
      <div className={`${containerClass} ${className}`}>
        <h1 className="text-4xl font-extrabold text-center">{title}</h1>
        {children}
        <Button {...submit} />
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
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={variants as any}
          className={`w-full flex items-center justify-center ${item.props.className}`}
        >
          {item}
        </motion.div>
      ))}
    </motion.form>
  );
};

export default FormWrapper;
