import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
const cn = (...args) => {
  return twMerge(clsx(...args));
};

export default cn;
