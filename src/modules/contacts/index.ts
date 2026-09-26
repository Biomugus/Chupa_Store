// src/modules/contacts/index.ts

export { default as ContactsPage } from './containers/ContactsPage';
export { contactFormSchema } from './model/contactFormSchema';
export { CONTACT_TOPIC_LABELS, parseTopic } from './model/contactTopics';
export type { ContactFormData, ContactTopic } from './types/contactTypes';
