// src/modules/contacts/services/sendFeedback.ts

import { httpClient } from '@/shared/api/httpClient';
import type { ContactFormData, FeedbackResponse } from '../types/contactTypes';

export default function sendFeedback(data: ContactFormData): Promise<FeedbackResponse> {
  return httpClient<FeedbackResponse>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
