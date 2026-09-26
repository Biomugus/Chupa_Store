// src/shared/ui/form/fieldControl.ts

import { cn } from '@/lib/utils';

/** Общий вид инпутов/селектов в формах (checkout, contacts). */
export const fieldControlClassName = cn(
  'min-w-0 w-full bg-white border-black text-black',
  'rounded-[6px] focus-visible:ring-white transition-all',
  'md:min-w-[300px]',
);
