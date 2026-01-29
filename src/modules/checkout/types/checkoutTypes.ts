// src/modules/checkout/types/checkoutTypes.ts

export enum PaymentMethod {
  CARD_TRANSFER = 'card_transfer',
  LEGAL_ENTITY = 'legal_entity',
}

export enum DeliveryService {
  POST_RUSSIA = 'post_russia',
  CDEK = 'cdek',
  YANDEX = 'yandex',
  DPD = 'dpd',
  PONY_EXPRESS = 'pony_express',
}

export enum ContactMethod {
  VK = 'vk',
  TELEGRAM = 'telegram',
}

export type OrderItem = {
  quantity: number;
  id: string;
  title: string;
  price: number;
  image?: string;
};

export type CartSnapshot = {
  items: OrderItem[];
  total: number;
};

export type CheckoutFormData = {
  location: string;
  paymentMethod: PaymentMethod;
  deliveryService: DeliveryService;
  fullName: string;
  phone: string;
  contactMethod: ContactMethod;
  contactValue: string;
};

export type OrderPayload = {
  clientRequestId: string;

  customer: {
    fullName: string;
    phone: string;
    contactMethod: ContactMethod;
    contactValue: string;
    location: string;
  };

  delivery: {
    service: DeliveryService;
  };

  payment: {
    method: PaymentMethod;
  };

  items: OrderItem[];
  total: number;
};

export type CreateOrderResponse =
  | { status: 'ok'; orderId: string }
  | { status: 'error'; code: 'VALIDATION_ERROR'; message: string };

export type CheckoutFormContainerProps = {
  cartSnapshot: CartSnapshot;
  onCloseCart: () => void;
  onOpenSuccessModal: () => void;
  clearCart: () => void;
};

export type CheckoutFormUIProps = {
  values: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  isValid: boolean;
  isLoading: boolean;
  isRetry: boolean;
  submitError: string | null;

  onChange: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;

  onSubmit: () => void;
  onRetry: () => void;
  cityAutocompleteProps: CityAutocompleteViewProps;
};

export interface CitySuggestion {
  value: string;
  city?: string | null;
  region: string;
}

export type CityAutocompleteViewProps = {
  value: string;
  inputValue: string;
  open: boolean;
  isLoading: boolean;
  error?: boolean;
  suggestions: { value: string }[];

  onOpenChange: (open: boolean) => void;
  onInputChange: (value: string) => void;
  onSelect: (value: string) => void;
};

export type UseCitySuggestionsResult = {
  suggestions: CitySuggestion[];
  isLoading: boolean;
};

export type CityAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};
