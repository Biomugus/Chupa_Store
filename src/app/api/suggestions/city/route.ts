import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { DadataResponse, DadataResponseSchema, DadataSuggestion } from './suggestionSchemas';

const RequestSchema = z.object({
  query: z.string().min(2),
});

// Автокомплит дёргается на каждое нажатие клавиши, поэтому лимит заметно
// выше, чем у /api/orders, но всё же ограничивает злоупотребление
// сторонним DaData-ключом.
const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`suggestions:city:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);

  if (!rateLimit.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { query } = RequestSchema.parse(body);

    const response = await fetch(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${process.env.DADATA_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          from_bound: { value: 'city' },
          to_bound: { value: 'city' },
          count: 10,
          language: 'ru',
          restrict_value: true,
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Address provider error' }, { status: 502 });
    }

    const rawData = await response.json();
    const parsed = DadataResponseSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid response from address provider' },
        { status: 502 },
      );
    }

    const data: DadataResponse = parsed.data;

    const suggestions = data.suggestions.map((s: DadataSuggestion) => ({
      value: s.value,
      city: s.data.city ?? s.data.settlement,
      region: s.data.region_with_type,
    }));

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 400 });
  }
}
