import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
}>;

export default function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return <div>{children}</div>;
}

