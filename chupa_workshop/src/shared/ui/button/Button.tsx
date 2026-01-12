import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}
