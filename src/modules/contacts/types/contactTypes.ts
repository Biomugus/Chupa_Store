// src/modules/contacts/types/contactTypes.ts

export type ContactTopic = 'question' | 'order' | 'custom' | 'partnership' | 'defect' | 'other';

export type ContactFormData = {
  name: string;
  contact: string;
  topic: ContactTopic;
  message: string;
  // Honeypot — у реальных пользователей всегда пустое.
  website: string;
};

export type ContactFormField = Exclude<keyof ContactFormData, 'website'>;

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export type FeedbackResponse = {
  status: 'ok';
};
