export type ModalType = 'nav' | 'cart' | null;

export type ModalPayload = unknown;

export interface ModalState {
  type: ModalType;
  payload?: ModalPayload;
}
