import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { ConstructorConfig } from '../types/ConstructorConfig';

export async function getConstructorConfig(): Promise<ConstructorConfig> {
  return httpClient<ConstructorConfig>(endpoints.constructor);
}
