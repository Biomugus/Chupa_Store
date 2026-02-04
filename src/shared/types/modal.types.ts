export type ModalType = 'nav' | 'cart' | 'product_detail' | 'filters' | null;

export type ModalPayload = unknown;

export interface ModalState {
  type: ModalType;
  payload?: ModalPayload;
}
