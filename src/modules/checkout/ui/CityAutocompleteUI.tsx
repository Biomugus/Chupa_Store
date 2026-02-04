// src/modules/checkout/ui/CityAutocompleteUI.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { CityAutocompleteViewProps } from '../types/checkoutTypes';

export function CityAutocompleteUI({
  value,
  inputValue,
  open,
  isLoading,
  error,
  suggestions,
  onOpenChange,
  onInputChange,
  onSelect,
}: CityAutocompleteViewProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'md:min-w-[300px] h-9 w-full px-3 py-1 rounded-md border border-black bg-white text-black flex justify-between items-center',
            error && 'border-destructive',
          )}
        >
          {value || 'Выберите город...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[160]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Введите название..."
            value={inputValue}
            onValueChange={onInputChange}
          />

          <CommandList className="bg-[white] border border-black text-white rounded-md">
            {isLoading && <div className="p-4 text-sm text-muted-foreground">Загрузка...</div>}

            <CommandEmpty className="text-black text-center p-2 text-sm">
              Город не найден.
            </CommandEmpty>

            <CommandGroup>
              {suggestions.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => onSelect(item.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
