import { ContactMethod, DeliveryService, PaymentMethod } from '../types/checkoutTypes';

export const paymentMap: Record<PaymentMethod, string> = {
  [PaymentMethod.CARD_TRANSFER]: 'Перевод на карту',
  [PaymentMethod.LEGAL_ENTITY]: 'Юр. лицо',
};

export const deliveryMap: Record<DeliveryService, string> = {
  [DeliveryService.POST_RUSSIA]: 'Почта России',
  [DeliveryService.CDEK]: 'СДЭК',
  [DeliveryService.YANDEX]: 'Яндекс.Доставка',
  [DeliveryService.DPD]: 'DPD',
  [DeliveryService.PONY_EXPRESS]: 'ПониЭкспресс',
};

export const contactMap: Record<ContactMethod, string> = {
  [ContactMethod.VK]: 'VK',
  [ContactMethod.TELEGRAM]: 'Telegram',
};
